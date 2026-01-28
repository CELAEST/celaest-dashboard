import React, { memo } from "react";
import { CustomerAsset } from "../../types";
import { UpdateItem } from "./UpdateItem";

interface UpdateListProps {
  assets: CustomerAsset[];
  expandedAsset: string | null;
  toggleExpanded: (id: string) => void;
}

export const UpdateList: React.FC<UpdateListProps> = memo(
  ({ assets, expandedAsset, toggleExpanded }) => {
    return (
      <div className="space-y-4">
        {assets.map((asset, index) => (
          <UpdateItem
            key={asset.id}
            asset={asset}
            expandedAsset={expandedAsset}
            toggleExpanded={toggleExpanded}
            index={index}
          />
        ))}
      </div>
    );
  },
);

UpdateList.displayName = "UpdateList";
