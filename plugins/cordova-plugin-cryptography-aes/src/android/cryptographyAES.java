package net.alkhansa.cryptographyaesplugin;

//Cordova imports
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

//Android imports
import android.content.Context;
import android.util.Log;
//import android.provider.Settings;
import android.util.Base64;

//Package Cryptografy
//import sun.misc.*;
import javax.crypto.*;
import java.security.SecureRandom;
import javax.crypto.spec.SecretKeySpec;

import java.security.MessageDigest;
import java.util.Arrays;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;


//JSON Imports
import org.json.JSONArray;
import org.json.JSONException;


public class cryptographyAES extends CordovaPlugin {
    //Define some constants for the supported actions
    public static final String ACTION_ENCRYPTION = "doEncryption";
    public static final String ACTION_DECRYPTION = "doDecryption";
    public static String IV = "AAAAAAAAAAAAAAAA";

    
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        
        //The plugin doesn't have direct access to the
        //application context, so you have to get it first
        Context context = this.cordova.getActivity().getApplicationContext();
       
    }
    
    @Override
    public boolean execute(String action, JSONArray args,
        CallbackContext callbackContext) throws JSONException {
            try {
                //First check on the getCarrierName
                if (ACTION_ENCRYPTION.equals(action)) {
                	String cipherTeks = " ";
//                	try {
	                	byte[] cipher = encrypt(args.getString(0), args.getString(1));
	                	cipherTeks = Base64.encodeToString(cipher, Base64.DEFAULT);
//                	} catch (Exception e) {
//                		System.err.println("Exception: " + e.getMessage());
//                        callbackContext.error("gilang : " + e.getMessage());
//                    } 
                    callbackContext.success(cipherTeks);
                    return true;
                } else {
                    //Next see if it is a getCountryCode action
                    if (ACTION_DECRYPTION.equals(action)) {
                    	String decryptedTeks = "";
                    	try {
                    		decryptedTeks = decrypt(args.getString(0), args.getString(1));
                    	} catch (Exception e) {
                    		System.err.println("Exception: " + e.getMessage());
                            callbackContext.error(e.getMessage());
                        } 
                        callbackContext.success(decryptedTeks);
                        return true;
                    }
                }
                //We don't have a match, so it must be an invalid action
                callbackContext.error("Invalid Action");
                return false;
            } catch (Exception e) {
                //If we get here, then something horrible has happened
                System.err.println("Exception: " + e.getMessage());
                callbackContext.error(e.getMessage());
                return false;
            }
    }

   

    public static byte[] encrypt(String plainText, String encryptionKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        SecretKeySpec key = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(plainText.getBytes());
    }

    public static String decrypt(String cipherText, String encryptionKey) throws Exception{
        //byte[] decodeCipher = Base64.decode(cipherText, Base64.DEFAULT);  
          byte[] decodeCipher = toByte(cipherText);
        Cipher cipher = Cipher.getInstance("AES");
        SecretKeySpec key = new SecretKeySpec(encryptionKey.getBytes(), "AES");
        cipher.init(Cipher.DECRYPT_MODE, key);
        return new String(cipher.doFinal(decodeCipher));
    }
      
    public static byte[] toByte(String hexString) {
        int len = hexString.length()/2;
        byte[] result = new byte[len];
        for (int i = 0; i < len; i++)
            result[i] = Integer.valueOf(hexString.substring(2*i, 2*i+2), 16).byteValue();
        return result;
    }
      
    public String toHex(byte[] buf) {
        if (buf == null)
            return "";
        StringBuffer result = new StringBuffer(2*buf.length);
        for (int i = 0; i < buf.length; i++) {
            appendHex(result, buf[i]);
        }
        return result.toString();
    }
        
    private final String HEX = "0123456789ABCDEF";
        
    private void appendHex(StringBuffer sb, byte b) {
        sb.append(HEX.charAt((b>>4)&0x0f)).append(HEX.charAt(b&0x0f));
    }
    
}