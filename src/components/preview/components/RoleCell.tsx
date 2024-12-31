import React from 'react';
import { ResourceList } from './ResourceList';
import type { RoleInfo } from '../../../store/templateStore';

interface RoleCellProps {
  roleInfo: RoleInfo;
  onResourceClick: (resources: any[]) => void;
}

export function RoleCell({
  roleInfo,
  onResourceClick
}: RoleCellProps) {
  return (
    <div className="mb-4">
      <div className="font-medium">
        {roleInfo.role.role_name || 'Unbenannte Rolle'}
      </div>
      <div className="text-sm text-gray-500">
        {roleInfo.role.task_description}
      </div>
      <div className="mt-2 space-y-2">
        <div className="text-sm text-gray-600">
          Lernumgebung: {roleInfo.environmentName}
        </div>
        
        {roleInfo.materials.length > 0 && (
          <ResourceList
            resources={roleInfo.materials}
            type="Lernressourcen"
            onResourceClick={onResourceClick}
          />
        )}
        
        {roleInfo.tools.length > 0 && (
          <ResourceList
            resources={roleInfo.tools}
            type="Werkzeuge"
            onResourceClick={onResourceClick}
          />
        )}
        
        {roleInfo.services.length > 0 && (
          <ResourceList
            resources={roleInfo.services}
            type="Dienste"
            onResourceClick={onResourceClick}
          />
        )}
      </div>
    </div>
  );
}