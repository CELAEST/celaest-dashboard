export type ReleaseStatus = "stable" | "beta" | "deprecated";

export interface Version {
  id: string;
  assetName: string;
  versionNumber: string;
  status: ReleaseStatus;
  releaseDate: string;
  fileSize: string;
  checksum: string;
  downloads: number;
  adoptionRate: number;
  changelog: string[];
  compatibility: string;
}

export interface CustomerAsset {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  purchaseDate: string;
  lastDownload: string;
  changelog: string[];
  compatibility: string;
  checksum: string;
}
