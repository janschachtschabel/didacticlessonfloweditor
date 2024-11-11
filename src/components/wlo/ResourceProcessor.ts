import { searchWLO } from '../../lib/wloApi';

interface ProcessOptions {
  endpoint: string;
  maxItems: number;
  combineMode: 'OR' | 'AND';
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processResourceItem(
  resource: any,
  type: string,
  environmentName: string,
  addStatus: (message: string) => void,
  options: ProcessOptions
) {
  addStatus(`\nVerarbeite ${type} "${resource.name}" in Lernumgebung "${environmentName}"`);

  if (!resource.filter_criteria || Object.keys(resource.filter_criteria).length === 0) {
    addStatus(`⚠️ Keine Filterkriterien definiert für ${type} "${resource.name}"`);
    return resource;
  }

  const properties = Object.keys(resource.filter_criteria);
  const values = Object.values(resource.filter_criteria) as string[];

  addStatus(`🔍 Suche mit Kriterien: ${properties.map((p, i) => `${p}=${values[i]}`).join(', ')}`);

  const params = new URLSearchParams();
  params.append('contentType', 'FILES');
  params.append('combineMode', options.combineMode);
  properties.forEach(prop => params.append('property', prop));
  values.forEach(value => params.append('value', value));
  params.append('maxItems', options.maxItems.toString());
  params.append('skipCount', '0');
  params.append('propertyFilter', '-all-');

  const requestUrl = `${options.endpoint}/search/v1/custom/-home-?${params.toString()}`;
  const curlCommand = `curl -X 'GET' '${requestUrl}' -H 'accept: application/json' -H 'Access-Control-Allow-Origin: *'`;

  addStatus(`\n📡 Request URL:\n${requestUrl}`);
  addStatus(`\n🔧 Curl command:\n${curlCommand}\n`);

  try {
    addStatus('⏳ Warte 2 Sekunden vor der Anfrage...');
    await delay(2000);

    addStatus('🚀 Sende Anfrage...');
    const searchResults = await searchWLO({
      properties,
      values,
      maxItems: options.maxItems,
      endpoint: options.endpoint,
      combineMode: options.combineMode
    });

    if (!searchResults.nodes || searchResults.nodes.length === 0) {
      addStatus(`ℹ️ Keine Ergebnisse gefunden für ${type} "${resource.name}"`);
      return resource;
    }

    const nodeIds = searchResults.nodes
      .map(node => node.nodeId)
      .filter(Boolean)
      .slice(0, options.maxItems)
      .join(',');

    if (!nodeIds) {
      addStatus(`⚠️ Ergebnisse gefunden, aber keine gültigen Node-IDs für ${type} "${resource.name}"`);
      return resource;
    }

    addStatus(`✅ ${searchResults.nodes.length} Ergebnisse gefunden, Node-IDs: ${nodeIds}`);
    
    return {
      ...resource,
      source: 'database',
      database_id: nodeIds,
      filter_criteria: undefined
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    console.error('Suchfehler Details:', error);
    
    addStatus(`\n❌ Fehler bei der Verarbeitung von ${type} "${resource.name}":`);
    addStatus(`   Fehlertyp: ${error instanceof Error ? error.name : 'Unbekannt'}`);
    addStatus(`   Fehlermeldung: ${errorMessage}`);
    
    if (error instanceof Error && error.stack) {
      addStatus(`   Stack trace: ${error.stack}`);
    }
    
    if (error instanceof Response) {
      addStatus(`   Status: ${error.status} ${error.statusText}`);
      try {
        const errorBody = await error.text();
        addStatus(`   Antwort-Body: ${errorBody}`);
      } catch (e) {
        addStatus(`   Konnte Antwort-Body nicht lesen: ${e}`);
      }
    }
    
    addStatus('\nNeuer Versuch in 5 Sekunden...');
    await delay(5000);
    
    try {
      addStatus('🔄 Wiederhole Anfrage...');
      const retryResults = await searchWLO({
        properties,
        values,
        maxItems: options.maxItems,
        endpoint: options.endpoint,
        combineMode: options.combineMode
      });

      if (!retryResults.nodes || retryResults.nodes.length === 0) {
        addStatus(`ℹ️ Wiederholung erfolgreich, aber keine Ergebnisse für ${type} "${resource.name}"`);
        return resource;
      }

      const retryNodeIds = retryResults.nodes
        .map(node => node.nodeId)
        .filter(Boolean)
        .slice(0, options.maxItems)
        .join(',');

      if (!retryNodeIds) {
        addStatus(`⚠️ Wiederholung fand Ergebnisse, aber keine gültigen Node-IDs für ${type} "${resource.name}"`);
        return resource;
      }

      addStatus(`✅ Wiederholung erfolgreich! ${retryResults.nodes.length} Ergebnisse gefunden, Node-IDs: ${retryNodeIds}`);
      
      return {
        ...resource,
        source: 'database',
        database_id: retryNodeIds,
        filter_criteria: undefined
      };
    } catch (retryError) {
      const retryErrorMessage = retryError instanceof Error ? retryError.message : 'Unbekannter Fehler';
      addStatus(`❌ Wiederholung ebenfalls fehlgeschlagen: ${retryErrorMessage}`);
      return resource;
    }
  }
}

export async function processResource(
  resource: any,
  type: string,
  selectedIds: string[] | undefined,
  environmentName: string,
  addStatus: (message: string) => void,
  options: ProcessOptions
) {
  if (!selectedIds?.includes(resource.id) || resource.source !== 'filter') {
    return resource;
  }

  return processResourceItem(resource, type, environmentName, addStatus, options);
}

export async function processResources(
  resources: any[],
  type: string,
  selectedIds: string[] | undefined,
  environmentName: string,
  addStatus: (message: string) => void,
  options: ProcessOptions
) {
  const updatedResources = [];
  
  // Process resources sequentially
  for (const resource of resources) {
    if (selectedIds?.includes(resource.id) && resource.source === 'filter') {
      const updatedResource = await processResourceItem(
        resource,
        type,
        environmentName,
        addStatus,
        options
      );
      updatedResources.push(updatedResource);
    } else {
      updatedResources.push(resource);
    }
  }
  
  return updatedResources;
}