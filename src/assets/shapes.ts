import { shapes, util } from '@clientio/rappid';

const Link = shapes.standard.Link.define('mapping.Link', {
    attrs: {
        line: {
            targetMarker: {
                'type': 'path',
                'fill': '#5755a1',
                'd': 'M 10 -5 0 0 10 5 z'
            },
            sourceMarker: {
                'type': 'path',
                'fill': '#5755a1',
                'd': 'M 0 -5 10 0 0 5 z'
            },
            stroke: 'gray'
        }
    }
});

const Constant = shapes.standard.BorderedRecord.define('mapping.Constant', {
    itemHeight: 20,
    itemOffset: 5,
    itemMinLabelWidth: 10,
    attrs: {
        root: {
            magnet: false
        },
        itemLabels: {
            fontSize: 12,
            fontFamily: 'Sans-serif',
        },
        itemLabels_1: {
            magnet: true
        },
        itemBodies_0: {
            fill: '#feb663'
        },
        itemBodies: {
            stroke: 'black'
        }
    },
    items: [
        [{
            id: 'icon',
            icon: 'assets/images/clipboard.svg',
        }],
        [{
            id: 'value',
            label: '',
            span: 2
        }],
        [

        ]
    ]
}, {

    setValue: function (value: string, opt: any) {
        this.prop(['items', 1, 0, 'label'], '"' + value + '"', opt);
    },

    getDefaultItem:  () =>{
        return {
            id: util.uuid(),
            label: '""',
            icon: 'assets/images/clipboard.svg'
        }
    },

    getItemTools:  () =>{
        return [
            { action: 'edit', content: 'Edit Constant' }
        ];
    },

    getTools:  () =>{
        return [
            { action: 'remove', content: 'Remove Constant' }
        ];
    },

    getInspectorConfig:  () =>{
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            }
        };
    }
});

const Concat = shapes.standard.HeaderedRecord.define('mapping.Concat', {
    itemHeight: 20,
    itemOffset: 5,
    padding: { top: 30, left: 10, right: 0, bottom: 0 },
    itemMinLabelWidth: 50,
    itemOverflow: true,
    attrs: {
        root: {
            magnet: false
        },
        header: {
            fill: '#fe854f'
        },
        headerLabel: {
            fontFamily: 'Sans-serif',
            fontWeight: 'bold',
            textWrap: {
                text: 'concat',
                ellipsis: true,
                height: 30
            }
        },
        itemLabels: {
            magnet: true,
            fontSize: 12,
            fontFamily: 'Sans-serif',
        },
        itemLabels_0: {
            magnet: 'passive',
            cursor: 'pointer'
        },
        itemBodies_0: {
            stroke: 'black'
        }
    },
    items: [
        [{
            id: 'value_1',
            label: 'Value 1',
            icon: 'assets/images/link.svg',
        }, {
            id: 'value_2',
            label: 'Value 2',
            icon: 'assets/images/link.svg',
        }, {
            id: 'value_3',
            label: 'Value 3',
            icon: 'assets/images/link.svg',
        }], [{
            id: 'result',
            label: 'Result ⇛',
            height: 40
        }]
    ]
}, {

    getNumberOfValues: function() {
        return this.prop(['items', 0]).length;
    },

    getDefaultItem: function() {
        return {
            id: util.uuid(),
            label: 'Value ' + (this.getNumberOfValues() + 1),
            icon: 'assets/images/link.svg'
        }
    },

    getItemTools: function(itemId : any) {
        var groupIndex = this.getItemGroupIndex(itemId);
        if (groupIndex !== 0) return null;
        var tools = [
            { action: 'edit', content: 'Edit Value' },
            { action: 'add-next-sibling', content: 'Add Value' }
        ];
        if (this.getNumberOfValues() > 2) {
            tools.push({ action: 'remove', content: 'Remove Value'});
        }
        tools.push();
        return tools;
    },

    getTools: () =>{
        return [
            { action: 'add-item', content: 'Add Value' },
            { action: 'remove', content: 'Remove Concat' }
        ];
    },

    getInspectorConfig: function(itemId : any) {
        var groupIndex = this.getItemGroupIndex(itemId);
        if (groupIndex !== 0) return null;
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            }
        };
    }
});

const GetDate = shapes.standard.HeaderedRecord.define('mapping.GetDate', {
    itemHeight: 20,
    itemOffset: 5,
    padding: { top: 30, left: 10, right: 0, bottom: 0 },
    itemMinLabelWidth: 50,
    itemOverflow: true,
    attrs: {
        root: {
            magnet: false
        },
        header: {
            fill: '#fe854f'
        },
        headerLabel: {
            fontFamily: 'Sans-serif',
            fontWeight: 'bold',
            textWrap: {
                text: 'get-date',
                ellipsis: true,
                height: 30
            }
        },
        itemLabels: {
            magnet: true,
            fontSize: 12,
            fontFamily: 'Sans-serif',
        },
        itemLabels_0: {
            magnet: 'passive',
            cursor: 'pointer'
        },
        itemBodies: {
            stroke: 'black'
        }
    },
    items: [
        [{
            id: 'value',
            label: '⇛ Value',
            height: 60
        }],
        [{
            id: 'year',
            label: 'year',
            icon: 'assets/images/link.svg',
        }, {
            id: 'month',
            label: 'month',
            icon: 'assets/images/link.svg',
        }, {
            id: 'day',
            label: 'day',
            icon: 'assets/images/link.svg',
        }]
    ]
}, {

    getDefaultItem: () =>{
        return {
            id: util.uuid(),
            label: 'item',
            icon: 'assets/images/document.svg'
        };
    },

    getItemTools:  () =>{
        return null;
    },

    getTools:  () =>{
        return [
            { action: 'remove', content: 'Remove GetDate' }
        ];
    },

    getInspectorConfig:  () =>{
        return null;
    }

});

const Record = shapes.standard.HeaderedRecord.define('mapping.Record', {
    itemHeight: 20,
    itemOffset: 15,
    itemMinLabelWidth: 70,
    padding: { top: 35, left: 10, right: 10, bottom: 5 },
    itemOverflow: true,
    attrs: {
        root: {
            magnet: false
        },
        header: {
            fill: '#31d0c6'
        },
        headerLabel: {
            fontFamily: 'Sans-serif',
            fontWeight: 'bold',
            textWrap: {
                ellipsis: true,
                height: 30
            }
        },
        buttonsGroups: {
            stroke: 'black'
        },
        forksGroups: {
            stroke: 'lightgray'
        },
        itemBodies: {
            itemHighlight: {
                'stroke': '#000000'
            }
        },
        itemLabels: {
            magnet: 'true',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'Sans-serif',
            itemHighlight: {
                'fill': '#fe854f'
            }
        },
        itemLabels_disabled: {
            magnet: null,
            fill: '#aaaaaa',
            cursor: 'not-allowed'
        }
    }
}, {

    setName: function (name: any, opt: any) {
        this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
    },

    getDefaultItem:  () =>{
        return {
            id: util.uuid(),
            label: 'new_item',
            icon: 'assets/images/document.svg'
        };
    },

    getItemTools:  () =>{
        return [
            { action: 'edit', content: 'Edit Item' },
            { action: 'add-child', content: 'Add Child' },
            { action: 'add-next-sibling', content: 'Add Next Sibling' },
            { action: 'add-prev-sibling', content: 'Add Prev Sibling' },
            { action: 'remove', content: 'Remove Item' }
        ];
    },

    getTools:  () =>{
        return [
            { action: 'add-item', content: 'Add Child' },
            { action: 'remove', content: 'Remove Record' }
        ];
    },

    getInspectorConfig:  () =>{
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            },
            icon: {
                label: 'Icon',
                type: 'select-button-group',
                options: [{
                    value: 'assets/images/link.svg',
                    content: '<img height="42px" src="assets/images/link.svg"/>'
                }, {
                    value: 'assets/images/document.svg',
                    content: '<img height="42px" src="assets/images/document.svg"/>'
                }, {
                    value: 'assets/images/clipboard.svg',
                    content: '<img height="42px" src="assets/images/clipboard.svg"/>'
                }, {
                    value: 'assets/images/file.svg',
                    content: '<img height="42px" src="assets/images/file.svg"/>'
                }]
            },
            highlighted: {
                label: 'Highlight',
                type: 'toggle'
            }
        }
    },
});


declare module '@clientio/rappid' {
    namespace shapes {
        namespace mapping {
            class Link extends shapes.standard.Link {
            }
            class Constant extends shapes.standard.BorderedRecord {
              setValue: any;
            }
            class Concat extends shapes.standard.HeaderedRecord {
            }
            class GetDate extends shapes.standard.HeaderedRecord {
            }
            class Record extends shapes.standard.HeaderedRecord {
            }
        }
    }

}
Object.assign(shapes, {
    mapping: {
        Link,
        Constant,
        Concat,
        GetDate,
        Record
    }
});