export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';
export type Source = 'Internal' | 'Generated';
export type Modality = 'Self-paced' | 'ILT' | 'Virtual';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  proficiency: Proficiency;
  source: Source;
  duration: string;
  modality: Modality;
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  toc: string[];
  locked: boolean;
  status?: 'warning' | 'review' | 'gap';
  statusMessage?: string;
  confidence?: number;
}

export interface GapModule {
  id: string;
  type: 'gap';
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  confidence: number;
  suggestedModules: { title: string; source: Source }[];
}

export const modules: LearningModule[] = [
  {
    id: 'm1',
    title: 'Introduction to DevOps Principles',
    description: 'Foundational concepts of DevOps culture, practices, and toolchain overview.',
    proficiency: 'Beginner',
    source: 'Internal',
    duration: '2h',
    modality: 'Self-paced',
    tags: ['Prerequisite', 'Recommended'],
    prerequisites: [],
    outcomes: ['Understand DevOps lifecycle', 'Identify key DevOps practices', 'Explain CI/CD fundamentals'],
    toc: ['What is DevOps?', 'DevOps Culture', 'CI/CD Overview', 'Toolchain Landscape'],
    locked: false,
    confidence: 98,
  },
  {
    id: 'm2',
    title: 'Azure DevOps Platform Overview',
    description: 'Navigating Azure DevOps services: Boards, Repos, Pipelines, Test Plans, Artifacts.',
    proficiency: 'Beginner',
    source: 'Internal',
    duration: '2.5h',
    modality: 'Self-paced',
    tags: ['Prerequisite'],
    prerequisites: ['m1'],
    outcomes: ['Navigate Azure DevOps portal', 'Create and configure projects', 'Understand service integration'],
    toc: ['Azure DevOps Services', 'Project Setup', 'Navigation & Settings', 'Service Connections'],
    locked: false,
    confidence: 96,
  },
  {
    id: 'm3',
    title: 'Azure Boards & Agile Planning',
    description: 'Work item tracking, sprint planning, and backlog management using Azure Boards.',
    proficiency: 'Intermediate',
    source: 'Internal',
    duration: '3h',
    modality: 'ILT',
    tags: ['Recommended'],
    prerequisites: ['m2'],
    outcomes: ['Configure boards and backlogs', 'Manage sprints and iterations', 'Create custom queries and dashboards'],
    toc: ['Work Items', 'Backlogs & Boards', 'Sprints', 'Queries & Dashboards'],
    locked: false,
    confidence: 94,
  },
  {
    id: 'm4',
    title: 'CI/CD Pipelines in Azure DevOps',
    description: 'Building, testing, and deploying applications using YAML-based Azure Pipelines.',
    proficiency: 'Intermediate',
    source: 'Internal',
    duration: '3.5h',
    modality: 'Virtual',
    tags: ['Prerequisite', 'Advanced'],
    prerequisites: ['m2'],
    outcomes: ['Create YAML pipelines', 'Configure build triggers', 'Implement multi-stage deployments'],
    toc: ['Classic vs YAML', 'Build Pipelines', 'Release Pipelines', 'Variables & Templates', 'Environments'],
    locked: false,
    confidence: 95,
    status: 'warning',
    statusMessage: 'Potential content overlap with Module 5 detected',
  },
  {
    id: 'm5',
    title: 'Azure Repos & Branching Strategies',
    description: 'Git workflows, pull request policies, and branch protection in Azure Repos.',
    proficiency: 'Intermediate',
    source: 'Internal',
    duration: '2h',
    modality: 'Self-paced',
    tags: ['Recommended'],
    prerequisites: ['m2'],
    outcomes: ['Implement Git branching strategies', 'Configure PR policies', 'Manage code reviews'],
    toc: ['Git Fundamentals', 'Branching Models', 'Pull Requests', 'Branch Policies'],
    locked: false,
    confidence: 93,
  },
  {
    id: 'm6',
    title: 'Infrastructure as Code with Azure DevOps',
    description: 'Integrating Terraform and ARM templates into Azure Pipelines for IaC automation.',
    proficiency: 'Advanced',
    source: 'Generated',
    duration: '3h',
    modality: 'Virtual',
    tags: ['Advanced', 'Recommended'],
    prerequisites: ['m4'],
    outcomes: ['Deploy infrastructure via pipelines', 'Manage state and environments', 'Implement approval gates'],
    toc: ['IaC Overview', 'Terraform Integration', 'ARM Templates', 'Pipeline Approvals', 'State Management'],
    locked: false,
    confidence: 87,
    status: 'review',
    statusMessage: 'SME review required — AI-generated content',
  },
  {
    id: 'm7',
    title: 'Security & Compliance in Azure DevOps',
    description: 'Implementing security scanning, compliance policies, and audit trails in Azure DevOps.',
    proficiency: 'Advanced',
    source: 'Generated',
    duration: '2h',
    modality: 'Self-paced',
    tags: ['Advanced'],
    prerequisites: ['m4', 'm6'],
    outcomes: ['Configure security scanning', 'Implement compliance gates', 'Audit pipeline activity'],
    toc: ['Security Overview', 'Credential Scanning', 'Compliance Policies', 'Audit Logs'],
    locked: false,
    confidence: 84,
  },
];

export const gap: GapModule = {
  id: 'gap-1',
  type: 'gap',
  title: 'Missing Advanced Module – Monitoring & Observability',
  severity: 'High',
  confidence: 92,
  suggestedModules: [
    { title: 'Azure Monitor Integration with DevOps', source: 'Generated' },
    { title: 'Application Insights for Pipeline Observability', source: 'Internal' },
  ],
};

export const explainabilityData = {
  orderReason: 'Module ordering is based on prerequisite dependency graph analysis and progressive proficiency mapping. The system ensures foundational concepts are covered before advancing to complex topics.',
  dependencySummary: 'Linear prerequisite chain from M1→M2, then M2 branches to M3, M4, M5. M4→M6→M7 forms the advanced track. M4 and M6 are both prerequisites for M7.',
  aiReasoning: [
    { module: 'M6: IaC with Azure DevOps', similarity: 0.91, skills: ['Terraform', 'ARM', 'Pipeline Integration'], confidence: 87 },
    { module: 'M7: Security & Compliance', similarity: 0.88, skills: ['Security Scanning', 'Compliance', 'Audit'], confidence: 84 },
  ],
  gapAnalysis: {
    area: 'Advanced — Monitoring & Observability',
    severity: 'High' as const,
    confidence: 92,
    description: 'No module covers production monitoring, alerting, or observability practices within Azure DevOps pipelines.',
  },
  citations: [
    { source: 'Microsoft Learn — Azure DevOps Documentation', confidence: 96 },
    { source: 'Azure DevOps Labs — Hands-on Tutorials', confidence: 94 },
    { source: 'DevOps Handbook (Jez Humble et al.)', confidence: 89 },
    { source: 'Terraform Azure Provider Documentation', confidence: 85 },
  ],
};
