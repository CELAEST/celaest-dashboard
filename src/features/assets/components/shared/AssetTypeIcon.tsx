import React from "react";
import { FileSpreadsheet, Code, Globe, LucideProps } from "lucide-react";
import { Asset } from "../../hooks/useAssets";

interface AssetTypeIconProps extends Omit<LucideProps, "ref"> {
  type: Asset["type"];
}

export const AssetTypeIcon: React.FC<AssetTypeIconProps> = ({
  type,
  size = 20,
  className,
  ...props
}) => {
  const baseClassName = className || "";

  switch (type) {
    case "excel":
      return (
        <FileSpreadsheet
          size={size}
          className={`text-emerald-500 ${baseClassName}`}
          {...props}
        />
      );
    case "script":
      return (
        <Code
          size={size}
          className={`text-blue-500 ${baseClassName}`}
          {...props}
        />
      );
    case "google-sheet":
      return (
        <Globe
          size={size}
          className={`text-orange-500 ${baseClassName}`}
          {...props}
        />
      );
    default:
      return null;
  }
};
