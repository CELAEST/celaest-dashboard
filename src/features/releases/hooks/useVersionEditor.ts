import { useState, useCallback } from "react";
import { Version } from "../types";

interface UseVersionEditorProps {
  version: Version | null;
  onSave: (version: Partial<Version> & { productId?: string; downloadUrl?: string; changelogItems?: string[] }) => void;
  onClose: () => void;
}

export const useVersionEditor = ({
  version,
  onSave,
}: UseVersionEditorProps) => {
  const [downloadUrl, setDownloadUrl] = useState<string>(version?.downloadUrl || "");

  const [formData, setFormData] = useState({
    productId: version?.productId || "",
    assetName: version?.assetName || "",
    versionNumber: version?.versionNumber || "",
    status: version?.status || ("beta" as Version["status"]),
    fileSize: version?.fileSize || "",
    checksum: version?.checksum || "",
    changelog: version?.changelog?.length ? version.changelog : [""],
    compatibility: version?.compatibility || "",
  });

  // Auto-fill version number from GitHub URL
  const handleUrlChange = useCallback((url: string) => {
    setDownloadUrl(url);
    const match = url.match(/releases\/download\/(v[\d.]+(?:-[\w.]+)?)\//i);
    if (match && !formData.versionNumber) {
      setFormData((prev) => ({ ...prev, versionNumber: match[1] }));
    }
  }, [formData.versionNumber]);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const generateChecksum = useCallback(() => {
    const randomHash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    handleChange("checksum", `sha256:${randomHash}...`);
  }, [handleChange]);

  const handleChangelogChange = useCallback((index: number, value: string) => {
    setFormData((prev) => {
      const newChangelog = [...prev.changelog];
      newChangelog[index] = value;
      return { ...prev, changelog: newChangelog };
    });
  }, []);

  const addChangelogItem = useCallback(() => {
    setFormData((prev) => ({ ...prev, changelog: [...prev.changelog, ""] }));
  }, []);

  const removeChangelogItem = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.changelog.length <= 1) return prev;
      return {
        ...prev,
        changelog: prev.changelog.filter((_, i) => i !== index),
      };
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cleanChangelog = formData.changelog.filter(
        (item) => item.trim() !== "",
      );
      onSave({
        ...formData,
        changelogItems: cleanChangelog,
        downloadUrl: downloadUrl || undefined,
      });
    },
    [formData, onSave, downloadUrl],
  );

  return {
    formData,
    handleChange,
    handleUrlChange,
    generateChecksum,
    handleChangelogChange,
    addChangelogItem,
    removeChangelogItem,
    handleSubmit,
    downloadUrl,
    setDownloadUrl,
  };
};
