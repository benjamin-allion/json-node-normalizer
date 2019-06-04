// JSON Object with some fields that must be converted to Array
const jsonToConvertSample = {
    root: {
        subField: {
            mProperty: 'TEST',
            mArrayProperty: {
                value: 'TEST',
            },
        },
        subArray: [
            {
                mProperty: 'TEST',
                mArrayProperty: {
                    value: 'TEST',
                },
            },
            {
                mProperty: 'TEST',
                mArrayProperty: {
                    values: {
                        value: 'TEST'
                    },
                },
            },
            {
                mProperty: 'TEST',
                mArrayProperty: {
                    values: [
                        {
                            value: 'TEST',
                        },
                        {
                            value: 'TEST',
                        },
                    ],
                },
            },
        ],
    },
};

module.exports = {
    jsonToConvertSample
}
