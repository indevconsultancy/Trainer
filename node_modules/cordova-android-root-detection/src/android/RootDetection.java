package cordova.plugins.rootDetection;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.scottyab.rootbeer.RootBeer;

/**
 * This class echoes a string called from JavaScript.
 */
public class RootDetection extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals(Actions.IS_ROOTED)) {
            isRooted(callbackContext);
            return true;
        }
        return false;
    }

    private void isRooted(CallbackContext callbackContext) {
        RootBeer rootBeer = new RootBeer(cordova.getActivity());
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, rootBeer.isRootedWithoutBusyBoxCheck());
        callbackContext.sendPluginResult(pluginResult);
    }

    interface Actions {
        String IS_ROOTED = "isRooted";
    }
}
