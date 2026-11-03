export type RoleTrack = 'all' | 'web-data' | 'it-support';
export type AssignableRoleTrack = 'web-data' | 'it-support';

export interface CertificatePreviewPayload {
  id: string;
  title: string;
  issuer: string;
  date: string;
  summary?: string;
  credentialId?: string;
  pdfUrl: string;
  fileName?: string;
}

export interface ProjectPipelineNode {
  id: string;
  step: string;
  label: string;
  metric: string;
  detail: string;
}

export interface RunbookCaselet {
  id: string;
  domain: 'IT Support' | 'Network' | 'Data Ops';
  title: string;
  context: string;
  symptom: string;
  diagnosis: string;
  resolution: string;
  outcome: string;
  tracks: AssignableRoleTrack[];
  relatedCertificate?: CertificatePreviewPayload;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  scoreLabel: string;
  scoreValue: string;
}

export interface CommunityItem {
  role: string;
  organization: string;
  year: string;
  location: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  certificateUrl?: string;
  certificateLabel?: string;
  tracks?: AssignableRoleTrack[];
}

export interface ProfileData {
  name: string;
  shortName: string;
  roleTitle: string;
  location: string;
  phone: string;
  whatsappUrl: string;
  email: string;
  cvPdfPath: string;
  cvFileName: string;
  cvFileSize: string;
  availabilityText: string;
  headlineGray: string;
  headlineBlack: string;
  summaryBold: string;
  summaryMuted: string;
  aboutHeadlineGray: string;
  aboutHeadlineBlack: string;
  socials: SocialLink[];
  education: EducationItem[];
  certifications: CertificationItem[];
  community: CommunityItem[];
}

export interface ProjectMediaBlockItem {
  id: string;
  layout: 'full' | 'two-col';
  caption: string;
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
}

export interface ProjectEvaluationTable {
  heading: string;
  columns: string[];
  rows: string[][];
}

export interface ProjectItem {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle?: string;
  category: 'Web Development' | 'Mobile App' | 'Python & Data';
  statusLabel: string;
  year: string;
  role: string;
  achievementMeta?: string;
  isFeatured: boolean;
  thumbnail: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  summary: string;
  cardTags: string[];
  problemStatement: string;
  approachHeading?: string;
  approachSummary: string;
  approachSteps: string[];
  sectionTwoMutedHeading?: string;
  sectionTwoPrimaryHeading?: string;
  resultsHeading?: string;
  evaluationTable?: ProjectEvaluationTable;
  evaluationInsight?: string;
  techStack: {
    name: string;
    purpose: string;
  }[];
  results: {
    metric: string;
    description: string;
  }[];
  repoUrl: string | null;
  repoButtonLabel?: string;
  repoStatusLabel: string;
  liveUrl: string | null;
  pipelineNodes?: ProjectPipelineNode[];
  mediaBlocks: ProjectMediaBlockItem[];
}

export interface ExperienceProofItem {
  label: string;
  url: string;
  number?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: 'Kerja' | 'Magang';
  highlights: string[];
  achievementCallout?: string;
  certificateUrl?: string;
  certificateLabel?: string;
  certificateNumber?: string;
  proofs?: ExperienceProofItem[];
  tracks?: AssignableRoleTrack[];
}

export interface TechSkillItem {
  name: string;
  category: 'dev' | 'tools' | 'learning';
  badge?: string;
  description?: string;
  tracks?: AssignableRoleTrack[];
}

export interface SupportingSkillGroup {
  title: string;
  items: string[];
}
