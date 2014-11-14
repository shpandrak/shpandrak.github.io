/**
 * Created by shpandrak on 11/14/14.
 */
var ShpanText  = {
    delay : 40,

    printShpanText : function (htmlElement, text) {
        this.nextCallback(htmlElement, text, 0);
    },

    nextCallback: function (htmlElement, text, i) {

        window.setTimeout(function () {
            ShpanText.prvCallback(htmlElement, text, i);
        }, ShpanText.delay);
    },

    prvCallback: function(htmlElement, text, i){
        if (i < text.length){
            htmlElement.innerHTML += text[i];
            ShpanText.nextCallback(htmlElement, text, i + 1);
        }
    }


}
