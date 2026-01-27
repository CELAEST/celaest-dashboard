import { Asset } from "../hooks/useAssets";

export const getAssetTypeLabel = (type: Asset["type"]): string => {
  switch (type) {
    case "excel":
      return "Excel Macro";
    case "script":
      return "Script/Code";
    case "google-sheet":
      return "Google Sheet";
    default:
      return type;
  }
};
