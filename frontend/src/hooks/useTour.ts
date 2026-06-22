'use client';

import { useCallback, useRef } from 'react';
import type { DriveStep } from 'driver.js';

const TOUR_SEEN_KEY = 'civictwin_tour_seen';

// ─── Per-page tour step definitions ───────────────────────────────────────────

const overviewSteps: DriveStep[] = [
  {
    popover: {
      title: '🏙️ Welcome to CivicTwin AI',
      description:
        'Your intelligent urban traffic management system. Let us walk you through the key features of the dashboard.',
      side: 'over',
      align: 'center',
    },
  },
  {
    element: '#dashboard-kpi-grid',
    popover: {
      title: '📊 Real-Time KPIs',
      description:
        'Four live metrics updated every minute: <b>Active Incidents</b>, <b>AI Predictions</b> completed, <b>Pending Actions</b> awaiting your approval, and overall <b>Resolution Rate</b>. Each card includes a sparkline trend.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#dashboard-traffic-map',
    popover: {
      title: '🗺️ Live Traffic Grid',
      description:
        'The Mapbox-powered map updates in real time via WebSocket. Road segments are color-coded by congestion level. AI-detected incidents appear as animated markers. Click any segment for details.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#dashboard-flow-legend',
    popover: {
      title: '🚦 Traffic Flow Legend',
      description:
        '<b>Green</b> = Free flow | <b>Yellow</b> = Light | <b>Orange</b> = Moderate | <b>Red</b> = Heavy | <b>Dark Red</b> = Gridlock. These colors update live as traffic conditions change.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#dashboard-incidents-panel',
    popover: {
      title: '⚠️ Recent Incidents',
      description:
        'The 5 most recent traffic incidents — each shows severity badge and current status. Click any row to view the full incident detail and dispatch actions.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#dashboard-ai-feed',
    popover: {
      title: '🧠 AI Activity Feed',
      description:
        'Live feed of ST-GCN + LSTM prediction jobs. Each job shows the incident it analyzed, model version, processing time (ms), and how many road segments were analyzed.',
      side: 'top',
      align: 'start',
    },
  },
];

const incidentSteps: DriveStep[] = [
  {
    element: '#incidents-header',
    popover: {
      title: '⚠️ Incident Management',
      description:
        'The command center for all traffic incidents. See active incident count at a glance. Use the <b>Report Incident</b> button (top right) to manually log a new incident.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#incidents-stats',
    popover: {
      title: '📊 Incident Statistics',
      description:
        'Live counts across four categories: <b>Total</b> incidents found, <b>Accidents</b>, <b>Congestions</b>, and <b>Critical/High</b> severity events. Updates as you apply filters.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#incidents-filters',
    popover: {
      title: '🔍 Search & Filter',
      description:
        'Filter incidents by <b>keyword</b> (title/description), <b>status</b> (Open, Investigating, Resolved, Closed), and <b>severity</b> (Low → Critical). Filters combine — a Reset button appears when active.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#incidents-list',
    popover: {
      title: '📋 Incident Table',
      description:
        'Sortable, paginated list of all incidents. Each row shows: ID, title with type icon, severity badge, status, and timestamp. Click any row or the eye icon to open the full detail page.',
      side: 'top',
      align: 'start',
    },
  },
];

const predictionSteps: DriveStep[] = [
  {
    element: '#predictions-header',
    popover: {
      title: '🧠 AI Traffic Predictions',
      description:
        'Our ST-GCN + LSTM model analyzes sensor data to predict traffic conditions 15, 30, and 60 minutes ahead. Use <b>Run Prediction</b> to trigger a new analysis on demand.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#predictions-stats',
    popover: {
      title: '📈 Prediction KPIs',
      description:
        'Tracks <b>Total Predictions</b> run, <b>Completion Rate</b>, average <b>Processing Time</b> (ms), and <b>AI Model</b> status. A healthy system shows >90% completion rate.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#predictions-model-info',
    popover: {
      title: '🤖 Model Explainer',
      description:
        'The <b>ST-GCN</b> (Spatio-Temporal Graph Convolutional Network) captures road network relationships, while <b>LSTM</b> handles time-series patterns. Together they achieve higher accuracy than either alone.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#predictions-list',
    popover: {
      title: '📋 Prediction Results',
      description:
        'Each card represents one prediction job. Click to expand and see <b>per-road segment</b> predictions: expected density % at +15/+30/+60 minutes, plus confidence scores. High-density segments are flagged in red.',
      side: 'top',
      align: 'start',
    },
  },
];

const simulationSteps: DriveStep[] = [
  {
    element: '#simulation-header',
    popover: {
      title: '🧪 Traffic Simulation',
      description:
        'Run "what-if" scenarios before real-world implementation. Simulate accidents, floods, construction zones, or major events to plan optimal traffic responses in advance.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#simulation-config',
    popover: {
      title: '⚙️ Scenario Parameters',
      description:
        'Configure 4 parameters: <b>Incident Type</b> (accident/flood/construction/event), <b>Severity Level</b>, <b>Location Area</b> (select any road segment), and <b>Prediction Horizon</b> (15–120 minutes). Then hit <b>Run Simulation</b>.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#simulation-map',
    popover: {
      title: '🗺️ Simulation Map',
      description:
        'The map visualizes the simulated impact — affected road segments are highlighted with a heat gradient. Green = minimal impact, Red = severe congestion. The overlay updates after each simulation run.',
      side: 'left',
      align: 'start',
    },
  },
];

const recommendationSteps: DriveStep[] = [
  {
    element: '#recommendations-header',
    popover: {
      title: '💡 Operator Decisions',
      description:
        'AI-generated action recommendations awaiting your review. Each recommendation includes a confidence score, the incident it references, and the AI\'s reasoning based on ST-GCN analysis.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#recommendations-grid',
    popover: {
      title: '📋 Recommendations Table',
      description:
        'Shows recommendation ID, type (signal adjustment, rerouting, alert, etc.), description with incident reference, and current status. Click the <b>AI Reasoning</b> toggle to see which road segments are affected and confidence levels.',
      side: 'top',
      align: 'start',
    },
  },
  {
    popover: {
      title: '✅ Approving Recommendations',
      description:
        'Click <b>Approve</b> (green) to execute the AI recommendation immediately — this triggers signal changes, rerouting commands, or citizen alerts via the mobile app. Click <b>Decline</b> to reject and optionally provide a reason.',
      side: 'over',
      align: 'center',
    },
  },
];

const cctvSteps: DriveStep[] = [
  {
    element: '#cctv-header',
    popover: {
      title: '📹 CCTV Monitoring',
      description:
        'Live feeds from traffic cameras across the city. The system shows how many cameras are currently <b>Online</b> vs <b>Offline</b>. Use <b>Refresh</b> to poll the latest sensor status.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#cctv-search',
    popover: {
      title: '🔍 Search Cameras',
      description:
        'Filter cameras by sensor code or location name. Useful when monitoring a specific intersection or district during an active incident.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#cctv-grid',
    popover: {
      title: '📷 Camera Grid',
      description:
        'Each card shows a live video feed with a <b>LIVE</b> badge, camera location, and timestamp. Hover to reveal the fullscreen button. Click any camera to expand it for a full-resolution view with YOLOv8 object detection overlay.',
      side: 'top',
      align: 'start',
    },
  },
];

const analyticsSteps: DriveStep[] = [
  {
    element: '#analytics-header',
    popover: {
      title: '📊 Traffic Analytics',
      description:
        'Historical data visualizations and performance metrics. Use <b>Refresh Data</b> to pull the latest figures from the database.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#analytics-kpi',
    popover: {
      title: '🔢 Key Performance Indicators',
      description:
        '6 metrics: <b>Total Incidents</b>, <b>Resolution Rate</b>, <b>AI Sessions</b> run, average <b>Processing Time</b>, average road <b>Density</b>, and average <b>AI Confidence</b> score. Each has a trend indicator.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#analytics-charts',
    popover: {
      title: '📈 Charts & Trends',
      description:
        'The <b>Incident Timeline</b> shows frequency over time. The <b>Severity Breakdown</b> pie chart shows proportion of Low/Medium/High/Critical incidents. The <b>Density Histogram</b> reveals peak congestion patterns.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#analytics-map',
    popover: {
      title: '🚗 Top Congested Roads',
      description:
        'Ranked list of the most congested road segments — shows current density %, average speed (km/h), and a visual progress bar. Use this to prioritize signal optimization or infrastructure planning.',
      side: 'top',
      align: 'start',
    },
  },
];

// ─── Route → Steps map ────────────────────────────────────────────────────────

const PAGE_STEPS: Record<string, { steps: DriveStep[]; label: string }> = {
  '/dashboard': { steps: overviewSteps, label: 'Command Center' },
  '/dashboard/incidents': { steps: incidentSteps, label: 'Incidents' },
  '/dashboard/predictions': { steps: predictionSteps, label: 'AI Predictions' },
  '/dashboard/simulation': { steps: simulationSteps, label: 'Simulation' },
  '/dashboard/recommendations': { steps: recommendationSteps, label: 'Recommendations' },
  '/dashboard/cctv': { steps: cctvSteps, label: 'CCTV' },
  '/dashboard/analytics': { steps: analyticsSteps, label: 'Analytics' },
};

function getCurrentPageKey(): string {
  const path = window.location.pathname;
  // exact match first, then prefix match
  if (PAGE_STEPS[path]) return path;
  const match = Object.keys(PAGE_STEPS).find(
    (k) => k !== '/dashboard' && path.startsWith(k)
  );
  return match ?? '/dashboard';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTour() {
  const driverRef = useRef<ReturnType<typeof import('driver.js')['driver']> | null>(null);

  const startTour = useCallback(async (pageKey?: string) => {
    const { driver } = await import('driver.js');
    await import('driver.js/dist/driver.css');

    const key = pageKey ?? getCurrentPageKey();
    const config = PAGE_STEPS[key] ?? PAGE_STEPS['/dashboard'];

    driverRef.current = driver({
      animate: true,
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      smoothScroll: true,
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: '✓ Done',
      popoverClass: 'civictwin-tour-popover',
      steps: config.steps,
      onDestroyed: () => {
        localStorage.setItem(TOUR_SEEN_KEY, 'true');
      },
    });

    driverRef.current.drive();
  }, []);

  /** Start the overview tour (sidebar nav highlight) */
  const startOverviewTour = useCallback(async () => {
    const { driver } = await import('driver.js');
    await import('driver.js/dist/driver.css');

    const navSteps: DriveStep[] = [
      {
        popover: {
          title: '🏙️ Welcome to CivicTwin AI',
          description:
            'Your intelligent urban traffic management system. This tour covers all main modules. Navigate to any page and press <b>Getting Started Tour</b> for a detailed guide of that specific screen.',
          side: 'over',
          align: 'center',
        },
      },
      {
        element: '#nav-traffic-map',
        popover: {
          title: '🗺️ Traffic Map',
          description:
            'Real-time Mapbox map of the entire city road network. Traffic density, speed, and active incidents are overlaid and updated live via WebSocket.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-incidents',
        popover: {
          title: '⚠️ Incident Management',
          description:
            'Log, track, and resolve traffic incidents. The system auto-detects events from IoT sensors and CCTV and alerts operators immediately.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-predictions',
        popover: {
          title: '🧠 AI Predictions',
          description:
            'ST-GCN + LSTM models forecast traffic conditions 15–60 minutes ahead with per-segment confidence scores. Triggers automatic recommendations.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-simulation',
        popover: {
          title: '🧪 Scenario Simulation',
          description:
            'Run "what-if" simulations for accidents, construction, or large events. See the impact on every road segment before making real-world decisions.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-recommendations',
        popover: {
          title: '💡 Smart Recommendations',
          description:
            'AI-generated action plans — signal adjustments, rerouting commands, public alerts. One click to approve and execute across the city.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-cctv',
        popover: {
          title: '📹 CCTV Monitoring',
          description:
            'Live feeds from city cameras with YOLOv8 object detection. Click any feed to go fullscreen. The system auto-flags unusual activity.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#nav-analytics',
        popover: {
          title: '📊 Analytics & Reports',
          description:
            'Historical trends, KPIs, incident timelines, and severity breakdowns. Export data for executive reports or planning sessions.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#tour-start-btn',
        popover: {
          title: '🎯 Page-Specific Tours',
          description:
            'Navigate to any page and press this button to get a <b>detailed tour</b> of every element on that specific screen. You\'re all set!',
          side: 'right',
          align: 'start',
        },
      },
    ];

    driverRef.current = driver({
      animate: true,
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      smoothScroll: true,
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: '✓ Done',
      popoverClass: 'civictwin-tour-popover',
      steps: navSteps,
      onDestroyed: () => {
        localStorage.setItem(TOUR_SEEN_KEY, 'true');
      },
    });

    driverRef.current.drive();
  }, []);

  const checkAndAutoStart = useCallback(async () => {
    const seen = localStorage.getItem(TOUR_SEEN_KEY);
    if (!seen) {
      setTimeout(() => startOverviewTour(), 800);
    }
  }, [startOverviewTour]);

  return { startTour, startOverviewTour, checkAndAutoStart };
}
