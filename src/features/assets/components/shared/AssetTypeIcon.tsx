import React from "react";
import {
  FileSpreadsheet,
  Code,
  Globe,
  Box,
  Plug,
  Palette,
  Layout,
  File,
  Briefcase,
  LucideProps,
} from "lucide-react";
import { Asset } from "../../services/assets.service";

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
    case "software":
      return (
        <Box
          size={size}
          className={`text-purple-500 ${baseClassName}`}
          {...props}
        />
      );
    case "plugin":
      return (
        <Plug
          size={size}
          className={`text-pink-500 ${baseClassName}`}
          {...props}
        />
      );
    case "theme":
      return (
        <Palette
          size={size}
          className={`text-cyan-500 ${baseClassName}`}
          {...props}
        />
      );
    case "template":
      return (
        <Layout
          size={size}
          className={`text-indigo-500 ${baseClassName}`}
          {...props}
        />
      );
    case "asset":
      return (
        <File
          size={size}
          className={`text-gray-500 ${baseClassName}`}
          {...props}
        />
      );
    case "service":
      return (
        <Briefcase
          size={size}
          className={`text-yellow-500 ${baseClassName}`}
          {...props}
        />
      );
    default:
      return null;
  }
};
