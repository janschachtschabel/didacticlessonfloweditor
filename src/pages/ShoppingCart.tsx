import { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { SaveLoad } from '../components/SaveLoad';
import { ResourceCard } from '../components/preview/components/ResourceCard';
import { searchWLO } from '../lib/wloApi';
import { BILDUNGSSTUFE_MAPPING, FACH_MAPPING, INHALTSTYP_MAPPING } from '../lib/mappings';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function ShoppingCart() {
  const state = useTemplateStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [educationalContext, setEducationalContext] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [contentType, setContentType] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedType, setSelectedType] = useState('material');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewEnvironmentDialog, setShowNewEnvironmentDialog] = useState(false);
  const [newEnvironmentName, setNewEnvironmentName] = useState('');
  const [newEnvironmentDescription, setNewEnvironmentDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [searchCriteria, setSearchCriteria] = useState<Array<{property: string, value: string}>>([]);
  const [maxItems, setMaxItems] = useState(5);
  const [combineMode, setCombineMode] = useState<'OR' | 'AND'>('AND');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    console.log('Starting search with criteria:', {
      searchTerm,
      educationalContext,
      discipline,
      contentType
    });
    try {
      const criteria = [];

      if (searchTerm) {
        criteria.push({
          property: 'cclom:title',
          value: searchTerm
        });
      }

      if (educationalContext) {
        criteria.push({
          property: 'ccm:educationalcontext',
          value: educationalContext
        });
      }

      if (discipline) {
        criteria.push({
          property: 'ccm:taxonid',
          value: discipline
        });
      }

      if (contentType) {
        criteria.push({
          property: 'ccm:oeh_lrt_aggregated',
          value: contentType
        });
      }

      if (criteria.length === 0) {
        setError('Bitte geben Sie mindestens ein Suchkriterium ein');
        setLoading(false);
        return;
      }

      // Store search criteria for pagination
      setSearchCriteria(criteria);

      await performSearch(criteria);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (criteria: Array<{property: string, value: string}>) => {
    try {
      const searchResponse = await searchWLO({
        properties: criteria.map(c => c.property),
        values: criteria.map(c => c.value),
        maxItems: 10,
        skipCount: currentPage * ITEMS_PER_PAGE,
        endpoint: 'https://redaktion.openeduhub.net/edu-sharing/rest',
        combineMode
      });
      
      if (!searchResponse.nodes) {
        setSearchResults([]);
        setTotalResults(0);
        setError('Keine Ergebnisse gefunden');
        setLoading(false);
        return;
      }

      console.log('Search response:', {
        total: searchResponse.total,
        nodes: searchResponse.nodes.length
      });

      // Update total results count from pagination info
      const total = searchResponse.pagination?.total || searchResponse.total || 0;
      setTotalResults(total);
      console.log('Total results:', total);

      setSearchResults(searchResponse.nodes.map((node: any) => ({
        name: node.properties['cclom:title']?.[0] || 'Ohne Titel',
        wlo_metadata: {
          title: node.properties['cclom:title']?.[0] || 'Ohne Titel',
          description: node.properties['cclom:general_description']?.[0] || '',
          subject: node.properties['ccm:taxonid_DISPLAYNAME']?.[0] || '',
          educationalContext: node.properties['ccm:educationalcontext_DISPLAYNAME'] || [],
          wwwUrl: node.properties['ccm:wwwurl']?.[0] || null,
          previewUrl: node.preview?.url || null,
          resourceType: node.properties['ccm:oeh_lrt_aggregated_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:resourcetype_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:oeh_lrt_aggregated']?.[0]?.split('/').pop() || 
                       'Lernressource'
        }
      })));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      setSearchResults([]);
      setTotalResults(0);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    
    console.log('Changing to page', newPage, 'with skipCount:', newPage * ITEMS_PER_PAGE);
    setLoading(true);
    setCurrentPage(newPage);
    
    try {
      const searchResponse = await searchWLO({
        properties: searchCriteria.map(c => c.property),
        values: searchCriteria.map(c => c.value),
        maxItems: 10,
        skipCount: newPage * ITEMS_PER_PAGE,
        endpoint: 'https://redaktion.openeduhub.net/edu-sharing/rest',
        combineMode
      });
      
      console.log('Search response:', {
        total: searchResponse.total,
        nodes: searchResponse.nodes?.length || 0,
        skipCount: newPage * ITEMS_PER_PAGE
      });

      if (!searchResponse.nodes) {
        setSearchResults([]);
        setTotalResults(0);
        setError('Keine Ergebnisse gefunden');
        return;
      }

      // Update total results count from pagination info
      const total = searchResponse.pagination?.total || searchResponse.total || 0;
      setTotalResults(total);

      setSearchResults(searchResponse.nodes.map((node: any) => ({
        name: node.properties['cclom:title']?.[0] || 'Ohne Titel',
        wlo_metadata: {
          title: node.properties['cclom:title']?.[0] || 'Ohne Titel',
          description: node.properties['cclom:general_description']?.[0] || '',
          subject: node.properties['ccm:taxonid_DISPLAYNAME']?.[0] || '',
          educationalContext: node.properties['ccm:educationalcontext_DISPLAYNAME'] || [],
          wwwUrl: node.properties['ccm:wwwurl']?.[0] || null,
          previewUrl: node.preview?.url || null,
          resourceType: node.properties['ccm:oeh_lrt_aggregated_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:resourcetype_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:oeh_lrt_aggregated']?.[0]?.split('/').pop() || 
                       'Lernressource'
        }
      })));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: any) => {
    setCartItems(prev => [...prev, item]);
    setSearchResults(prev => prev.filter(result => result !== item));
  };

  const removeFromCart = (item: any) => {
    setCartItems(prev => prev.filter(cartItem => cartItem !== item));
    setSearchResults(prev => [...prev, item]);
  };

  const handleCreateEnvironment = () => {
    if (!newEnvironmentName.trim()) {
      setError('Bitte geben Sie einen Namen für die Lernumgebung ein');
      return;
    }

    const envNumber = state.environments.length + 1;
    const envId = `ENV${envNumber}`;
    
    state.addEnvironment({
      id: envId,
      name: newEnvironmentName.trim(),
      description: newEnvironmentDescription.trim(),
      materials: [],
      tools: [],
      services: []
    });

    setSelectedEnvironment(envId);
    setShowNewEnvironmentDialog(false);
    setNewEnvironmentName('');
    setNewEnvironmentDescription('');
  };

  const handleSave = () => {
    if (!selectedEnvironment || !selectedType) {
      setError('Bitte wählen Sie eine Lernumgebung und einen Ressourcentyp aus');
      return;
    }

    const env = state.environments.find(e => e.id === selectedEnvironment);
    if (!env) return;

    const newResources = cartItems.map((item, index) => {
      const baseResource = {
        id: `${selectedEnvironment}-${selectedType.charAt(0).toUpperCase()}${env[`${selectedType}s`].length + index + 1}`,
        name: item.name,
        source: 'database',
        access_link: item.wlo_metadata.wwwUrl || '',
        wlo_metadata: item.wlo_metadata
      };

      switch (selectedType) {
        case 'material':
          return {
            ...baseResource,
            material_type: item.wlo_metadata.subject || 'Allgemein'
          };
        case 'tool':
          return {
            ...baseResource,
            tool_type: 'Software'
          };
        case 'service':
          return {
            ...baseResource,
            service_type: 'Digital'
          };
      }
    });

    state.updateEnvironment(selectedEnvironment, {
      [`${selectedType}s`]: [...env[`${selectedType}s`], ...newResources]
    });

    setCartItems([]);
    setError('Ressourcen wurden erfolgreich zur Lernumgebung hinzugefügt');
  };


  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">WLO Warenkorb</h1>
        <SaveLoad />
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-amber-900">
          Hier können Sie nach WLO-Bildungsinhalten suchen und diese für Ihre Lernumgebungen vormerken. 
          Wählen Sie die gewünschten Inhalte aus und fügen Sie sie Ihrer Vormerkliste hinzu. 
          Anschließend können Sie die Inhalte einer Lernumgebung zuordnen und als Material, Werkzeug oder Dienst speichern.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Suchbegriff eingeben..."
                className="w-full p-3 border rounded-lg"
              />

              <div className="grid grid-cols-3 gap-4">
                <select
                  value={educationalContext}
                  onChange={(e) => setEducationalContext(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="">Bildungskontext wählen...</option>
                  {Object.entries(BILDUNGSSTUFE_MAPPING).map(([label, uri]) => (
                    <option key={uri} value={uri}>{label}</option>
                  ))}
                </select>

                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="">Fach wählen...</option>
                  {Object.entries(FACH_MAPPING).map(([label, uri]) => (
                    <option key={uri} value={uri}>{label}</option>
                  ))}
                </select>

                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="">Inhaltstyp wählen...</option>
                  {Object.entries(INHALTSTYP_MAPPING).map(([label, uri]) => (
                    <option key={uri} value={uri}>{label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Suche läuft...' : 'Suchen'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Suchergebnisse</h2>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((result, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => addToCart(result)}
                    className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full hover:bg-green-600 z-10"
                    title="Zum Warenkorb hinzufügen"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                  </button>
                  <ResourceCard resource={result} />
                </div>
              ))}
            </div>
            {searchResults.length === 0 && !loading && (
              <p className="text-gray-500 text-center">Keine Suchergebnisse gefunden</p>
            )}

            {/* Pagination */}
            {totalResults > ITEMS_PER_PAGE && (
              <div className="mt-6">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Zurück
                  </button>
                  <span className="text-sm">
                    Seite {currentPage + 1} von {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Weiter →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Vorgemerkte Inhalte</h2>
            
            <div className="space-y-4 mb-6">
              <select
                value={selectedEnvironment}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setShowNewEnvironmentDialog(true);
                  } else {
                    setSelectedEnvironment(e.target.value);
                  }
                }}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Lernumgebung wählen...</option>
                {state.environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
                <option value="new">+ Neue Lernumgebung erstellen</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="material">Als Lernressource</option>
                <option value="tool">Als Werkzeug</option>
                <option value="service">Als Dienst</option>
              </select>

              <button
                onClick={handleSave}
                disabled={cartItems.length === 0 || !selectedEnvironment}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
              >
                Speichern ({cartItems.length} Inhalte)
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => removeFromCart(item)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                    title="Aus Warenkorb entfernen"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <ResourceCard resource={item} />
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-gray-500 text-center">Keine Inhalte vorgemerkt</p>
              )}
            </div>
          </div>
        </div>

        {/* New Environment Dialog */}
        {showNewEnvironmentDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Neue Lernumgebung erstellen</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newEnvironmentName}
                    onChange={(e) => setNewEnvironmentName(e.target.value)}
                    placeholder="z.B. Mathematik-Klassenraum"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Beschreibung</label>
                  <textarea
                    value={newEnvironmentDescription}
                    onChange={(e) => setNewEnvironmentDescription(e.target.value)}
                    placeholder="Beschreiben Sie die Lernumgebung..."
                    rows={3}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNewEnvironmentDialog(false)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleCreateEnvironment}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Erstellen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}