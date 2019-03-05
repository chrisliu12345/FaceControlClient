/**
 * Created by seshi on 2017/6/12.
 */

(function(window, document, $, angular) {

    'use strict';

    angular.module('datatable', [])
        .directive('datatable', dataTable)
        .factory('DTOptionsBuilder', dtOptionsBuilder)
        .factory('DTColumnBuilder', dtColumnBuilder);

    function dataTable() {
        function link(scope, element, attrs) {
            var dtId = '#' + attrs.id;
            scope[attrs["dtOptions"]].destroy = true;
            scope[attrs["dtOptions"]].bDeferRender = true;
            scope[attrs["dtOptions"]].sPaginationType = "full_numbers";
            scope[attrs["dtOptions"]].aoColumns = scope[attrs["dtColumns"]];

            scope.$watch(attrs["dtDataset"], function(newValue, oldValue) {
                if(newValue === oldValue){
                    return;
                }
                scope["manual$applyTag"] = false;
                scope["headerCompiled"] = false;
                scope[attrs["dtOptions"]].aaData = newValue;
                console.log( scope[attrs["dtOptions"]].aaData);
                $(dtId).DataTable(scope[attrs["dtOptions"]]);
            });
        }

        return {
            link: link
        };
    }

    function dtOptionsBuilder() {

        var DTOptions = {

            withOption: function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            },
            // withDestroy: function () {
            //     this.destroy = true;
            //     return this;
            // },
            withOrder: function (order) {
                this.order = order;
                return this;
            },
            withNotPaging: function () {
                this.paging = false;
                return this;
            },
            withNotSort: function () {
                this.bSort = false;
                return this;
            },
            withNotFilter: function () {
                this.bFilter = false;
                return this;
            },
            withNotAutoWidth: function () {
                this.bAutoWidth = false;
                return this;
            },
            withNotLengthChange: function () {
                this.bLengthChange = false;
                return this;
            }
        };

        return {
            newOptions: function() {
                return Object.create(DTOptions);
            }
        };
    }

    function dtColumnBuilder() {
        /**
         * The wrapped datatables column
         * @param mData the data to display of the column
         * @param sTitle the sTitle of the column title to display in the DOM
         */
        var DTColumn = {
            /**
             * Add the option of the column
             * @param key the key of the option
             * @param value an object or a function of the option
             * @returns {DTColumn} the wrapped datatables column
             */
            withOption: function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            },

            /**
             * Set the title of the colum
             * @param sTitle the sTitle of the column
             * @returns {DTColumn} the wrapped datatables column
             */
            withTitle: function(sTitle) {
                this.sTitle = sTitle;
                return this;
            },

            /**
             * Set the CSS class of the column
             * @param sClass the CSS class
             * @returns {DTColumn} the wrapped datatables column
             */
            withClass: function(sClass) {
                this.sClass = sClass;
                return this;
            },

            /**
             * Hide the column
             * @returns {DTColumn} the wrapped datatables column
             */
            notVisible: function() {
                this.bVisible = false;
                return this;
            },

            /**
             * Set the column as not sortable
             * @returns {DTColumn} the wrapped datatables column
             */
            notSortable: function() {
                this.bSortable = false;
                return this;
            },

            /**
             * Render each cell with the given parameter
             * @mRender mRender the function/string to render the data
             * @returns {DTColumn} the wrapped datatables column
             */
            renderWith: function(mRender) {
                this.mRender = mRender;
                return this;
            }
        };

        return {
            /**
             * Create a new wrapped datatables column
             * @param mData the data of the column to display
             * @param sTitle the sTitle of the column title to display in the DOM
             * @returns {DTColumn} the wrapped datatables column
             */
            newColumn: function(mData, sTitle) {
                if (angular.isUndefined(mData)) {
                    throw new Error('The parameter "mData" is not defined!');
                }
                var column = Object.create(DTColumn);
                column.mData = mData;
                if (angular.isDefined(sTitle)) {
                    column.sTitle = sTitle;
                }
                column.defaultContent = " ";
                /*column.defaultContent = "缺少此项信息11";*/20170830
                return column;
            },
            DTColumn: DTColumn
        };
    }

})(window, document, jQuery, angular);
