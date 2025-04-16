// Add this script to your project to help diagnose Google Sign-In issues
// Place it in a file like /public/js/google-auth-debug.js and include it in your layout

(function() {
    // Wait for the Google API to load
    const checkGoogleApi = setInterval(() => {
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        clearInterval(checkGoogleApi);
        console.log('[Google Auth Debug] Google API loaded successfully');
        
        // Check if client ID is properly set
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.error('[Google Auth Debug] ERROR: Google Client ID is not defined in environment variables');
          showErrorBanner('Google Client ID is missing. Check your .env.local file.');
          return;
        }
  
        try {
          // Log the current origin for reference
          const currentOrigin = window.location.origin;
          console.log(`[Google Auth Debug] Current origin: ${currentOrigin}`);
          console.log('[Google Auth Debug] Make sure this origin is authorized in your Google Cloud Console');
        
          // Create a test initialization to see if it works
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              console.log('[Google Auth Debug] Test initialization worked!');
            },
            error_callback: (error) => {
              console.error('[Google Auth Debug] Initialization error:', error);
              
              // Check for common errors
              if (error.type === 'popup_failed_to_open') {
                showErrorBanner('Google popup blocked. Please allow popups for this site.');
              } else if (error.type === 'origin_mismatch') {
                showErrorBanner(`Origin mismatch. Current origin "${currentOrigin}" is not authorized in Google Cloud Console.`);
              } else if (error.type === 'invalid_client') {
                showErrorBanner('Invalid client ID. Check your Google Cloud Console settings.');
              } else {
                showErrorBanner(`Google authentication error: ${error.type || 'Unknown error'}`);
              }
            }
          });
          
          console.log('[Google Auth Debug] Test initialization completed without errors');
        } catch (error) {
          console.error('[Google Auth Debug] Error during initialization:', error);
          showErrorBanner(`Google API error: ${error.message || 'Unknown error'}`);
        }
      }
    }, 100);
  
    // Timeout after 10 seconds if Google API doesn't load
    setTimeout(() => {
      clearInterval(checkGoogleApi);
      if (typeof window.google === 'undefined' || !window.google.accounts) {
        console.error('[Google Auth Debug] Google API failed to load within timeout period');
        showErrorBanner('Google Sign-In API failed to load. Check your network connection and script inclusion.');
      }
    }, 10000);
  
    // Helper function to show error banner for developers
    function showErrorBanner(message) {
      // Only show in development environment
      if (process.env.NODE_ENV === 'development') {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.backgroundColor = '#f8d7da';
        banner.style.color = '#721c24';
        banner.style.padding = '10px';
        banner.style.zIndex = '9999';
        banner.style.textAlign = 'center';
        banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        banner.style.fontSize = '14px';
        banner.style.borderBottom = '1px solid #f5c6cb';
        
        banner.innerHTML = `
          <strong>Google Auth Debug:</strong> ${message}
          <button style="margin-left: 10px; background: #721c24; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer;">
            Dismiss
          </button>
        `;
        
        document.body.prepend(banner);
        
        banner.querySelector('button').addEventListener('click', () => {
          banner.remove();
        });
      }
    }
  })();