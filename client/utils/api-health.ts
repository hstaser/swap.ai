/**
 * API Health Check Utility
 * Tests connectivity to backend endpoints
 */

export async function testApiConnectivity(): Promise<{
  isHealthy: boolean;
  endpoints: Record<string, boolean>;
  errors: string[];
}> {
  const endpoints = {
    health: "/api/health",
    portfolio: "/api/portfolio/holdings",
    swipeable: "/api/stocks/swipeable",
    watchlist: "/api/watchlist"
  };

  const results: Record<string, boolean> = {};
  const errors: string[] = [];

  for (const [name, url] of Object.entries(endpoints)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET'
      });
      
      clearTimeout(timeoutId);
      results[name] = response.ok;
      
      if (!response.ok) {
        errors.push(`${name}: HTTP ${response.status}`);
      }
    } catch (error) {
      results[name] = false;
      errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const isHealthy = Object.values(results).every(Boolean);

  return { isHealthy, endpoints: results, errors };
}

export function logApiHealth() {
  testApiConnectivity().then(({ isHealthy, endpoints, errors }) => {
    console.group("🔍 API Health Check");
    console.log("Overall Status:", isHealthy ? "✅ Healthy" : "❌ Issues Detected");
    
    Object.entries(endpoints).forEach(([name, status]) => {
      console.log(`${status ? "✅" : "❌"} ${name}`);
    });
    
    if (errors.length > 0) {
      console.group("Errors:");
      errors.forEach(error => console.log(`❌ ${error}`));
      console.groupEnd();
    }
    
    console.groupEnd();
  });
}
