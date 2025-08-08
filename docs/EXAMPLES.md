# Scene Data Examples

The `public/sceneData/` folder contains JSON files that feed the layout engine. Each file matches a schema in `/schemas/`.

## Hero
```json
{
  "type": "hero",
  "title": "Welcome to Product Image Studio",
  "subtitle": "Your personal visual engine",
  "backgroundColor": "#fef9f4",
  "image": {
    "src": "https://placehold.co/800x400?text=Mock+Screenshot",
    "alt": "Example template screenshot"
  }
}
```

## Notion Dashboard
```json
{
  "type": "notionDashboard",
  "mainHeading": "Plan without burnout",
  "subHeading": "This dashboard helps you pace the journey",
  "browserUrl": "mondaychick.co",
  "dashboardTitle": "My Weekly Planner",
  "sections": [
    {
      "title": "This Week's Focus",
      "emoji": "",
      "items": [
        { "text": "Review project roadmap", "checked": true },
        { "text": "Schedule team check-ins", "checked": false },
        { "text": "Prepare presentation slides", "checked": false }
      ]
    },
    {
      "title": "Energy Management",
      "emoji": "",
      "items": [
        { "text": "Morning meditation (15 min)", "checked": true },
        { "text": "Take lunch break away from desk", "checked": false }
      ]
    }
  ]
}
```
