import AsyncStorage from '@react-native-community/async-storage';

class Utility {
    
    /**
        * stores driver data in local storage.
        * @param {stores the data with this key} key_to_be_paired
        * @param {data to be stored} data_to_save
    */
    storeData = async (key_to_be_paired, data_to_save) => {
        try {
            //console.log(key_to_be_paired, data_to_save);
            await AsyncStorage.setItem(key_to_be_paired, JSON.stringify(data_to_save));
       } catch (error) {
            // Error saving data
            console.log("error while storing", error);
        }
    };

    /**
        * returns data stored with the key
        * @param {returns the data stored with this key} key_to_be_fetched
    */
    retrieveData = async (key_to_be_fetched) => {
        try {
            //console.log('getting>>>>>>', key_to_be_fetched);
            const value = await AsyncStorage.getItem(key_to_be_fetched);
            if (value !== null) {
                // We have data!!
                return value;
            }
            
        } catch (error) {
            // Error retrieving data
            console.log("error in fetching async", error);
        }
    };

    /**
        * removes the data that is stored with this key
        * @param {remove the data stored with this key} key_to_be_removed
    */
    removeData = async (key_to_be_removed) => {
        try {
            await AsyncStorage.removeItem(key_to_be_removed);
        } catch (error) {
            // Error retrieving data
            console.log("error in removing async", error);
        }
    };
}

export default new Utility();