export interface NotionDashboardScene {
  type: 'notionDashboard';
  mainHeading: string;
  subHeading: string;
  browserUrl: string;
  dashboardTitle: string;
  sections: Array<{
    title: string;
    emoji: string;
    items: Array<{
      text: string;
      checked: boolean;
    }>;
  }>;
}
