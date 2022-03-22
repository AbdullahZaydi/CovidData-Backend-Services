import _ from 'underscore';
import fs from 'fs';

export const JSONUtil = (
    function () {
        var instance;
        return {
            /**
             * @returns {JSONUtils} Instantiates Singleton JSONUtils class
             */
            getInstance: function (model) {
                if (!instance) {
                    instance = new JSONUtils(model);
                }
                return instance;
            }
        };

    }
)();

class JSONUtils {
    #model = undefined;
    #result = undefined;
    #queue = undefined;
    constructor(model) {
        this.#model = model;
        this.#queue = Promise.resolve();
    }
    /**
     * @param {function} callback adds callback to the queue.
     */
    then(callback) {
        callback(this.#queue);
    }

    /**
     * @param {function} callback 
     * @returns {this.#queue} queue with your callback function.
     */
    #chain(callback) {
        return (this.#queue = this.#queue.then(callback));
    }

    #syncWithFile() {
        fs.writeFileSync('./models/covid.json', JSON.stringify(this.#model));
    }

    /**
     * 
     * @returns {this} returns an array of all countries that exists in the list. Call value() afterwards if you don't want to use other chain functions.
     */
    countryList() {
        this.#chain(() => {
            this.#result = Object.keys(this.#model);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName countryName that you want to add.
     * @param {Object} data Data that you want to add inside the countryName.
     * @returns returns array of data with added data.
     */
    addCountry(countryName, data) {
        this.#chain(() => {
            this.#model[countryName] = data;
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName countryName that you want to update.
     * @param {Object} data Data that you want to add inside the countryName.
     * @returns returns array of data with added data.
    */
    editCountry(countryName, data) {
        this.#chain(() => {
            this.#model[countryName] = {
                ...this.#model[countryName],
                ...data
            };
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName countryName that you want to delete.
     * @returns returns array of data with added data.
    */
    deleteCountry(countryName, data) {
        this.#chain(() => {
            delete this.#model[countryName];
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName pass a country name to get covid updates.
     * @returns {this} returns an array of covid data based on what country name you entered. Call value() afterwards if you don't want to use other chain functions.
    */
    getDataByCountry(countryName) {
        this.#chain(() => {
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName countryName which you want to add data too.
     * @param {Array} data Data that you want to add in an array.
     * @returns returns array of data with added data.
     */
    addDataToCountry(countryName, data) {
        this.#chain(() => {
            this.#model[countryName].data.push(data);
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName Country Name
     * @param {String} date date that you want to edit.
     * @param {Array} data data that you want to edit.
     * @returns returns an array with updated data.
     */
    editDataInCountry(countryName, date, data) {
        this.#chain(() => {
            let countryData = this.#model[countryName];
            countryData.data = countryData.data.map(d => {
                if (d.date === date) {
                    d = {
                        ...d,
                        ...data
                    };
                }
                return d;
            });
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {String} countryName Country Name
     * @param {String} date date that you want to edit.
     * @param {Array} data data that you want to edit.
     * @returns returns an array with updated data.
     */
    deleteDataInCountry(countryName, date) {
        this.#chain(() => {
            let countryData = this.#model[countryName];
            countryData.data = countryData.data.filter(d => d.date !== date);
            this.#syncWithFile();
            this.#result = Object.assign({}, this.#model[countryName]);
        });
        return this;
    }

    /**
     * 
     * @param {{}} conditions pass an object of conditions just like you pass in mongodb. Check this documentation https://underscorejs.org/#where to know more about this function.
     * @param {Array?} arr pass an array if you don't want to use #result parameter.
     * @returns {this} returns an array of filtered result based on conditions passed as parameter. Call value() afterwards if you don't want to use other chain functions.
     */
    where(conditions, arr) {
        this.#chain(() => {
            if (this.#result !== undefined && this.#result !== null && arr === undefined) {
                this.#result = _.where(this.#result, conditions);
            }
            else {
                this.#result = _.where(arr, conditions);
            }
        });
        return this;
    }

    /**
     * @returns {Array} Returns a formatted array. Call this method at the end when you have performed all the other actions.
     */
    value() {
        return (this.#chain(() => this.#result));
    }
}