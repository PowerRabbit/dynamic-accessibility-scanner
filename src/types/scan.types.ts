export type AccessibilityIssue = {
    id: string;
    impact: ImpactLevel;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: AccessibilityNode[];
  };

export type AccessibilityNode = {
    any: CheckResult[];
    all: CheckResult[];
    none: CheckResult[];
    impact: ImpactLevel;
    html: string;
    target: string[];
    failureSummary: string;
  };

export type CheckResult = {
    id: string;
    data: null | ContrastData;
    relatedNodes: RelatedNode[];
    impact: ImpactLevel;
    message: string;
  };

export type ContrastData = {
    messageKey: string;
    contrastRatio: number;
    requiredContrastRatio: number;
    nodeColor: string;
    parentColor: string;
  };

export type RelatedNode = {
    html: string;
    target: string[];
  };

export type ImpactLevel = 'minor' | 'moderate' | 'serious' | 'critical' | string;
