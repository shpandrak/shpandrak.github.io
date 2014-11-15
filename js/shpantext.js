/**
 * Created by shpandrak on 11/14/14.
 */
var ShpanText  = {
    delay : 40,

    plugins :  {
        pluginWait: function(htmlElement, text, i){
            var skip = 5;  // skip at least 5
            var subStr = text.substr(i);
            subStr = /\d+/.exec(subStr)[0];
            skip += subStr.length;
            var charPause = parseInt(subStr);
            window.setTimeout(function(){
                ShpanText.nextCallback(htmlElement, text, i + skip);
            }, charPause);
        },

        pluginDelete: function(htmlElement, text, i) {
            var subStr = text.substr(i);
            var skip = 5;  // skip at least 5
            subStr = /\d+/.exec(subStr)[0];
            skip += subStr.length;
            var charactersToRemove = parseInt(subStr);
            ShpanText.deleteCharactersAndContinue(charactersToRemove, htmlElement, text, i + skip);

        }

    },

    printShpanText : function (htmlElement, text) {
        this.nextCallback(htmlElement, text, 0);
    },

    nextCallback: function (htmlElement, text, i) {

        window.setTimeout(function () {
            ShpanText.prvPrint(htmlElement, text, i);
        }, ShpanText.delay);
    },

    deleteCharactersAndContinue: function (numberOfCharactersToDelete, htmlElement, text, i) {
        window.setTimeout(function () {
            ShpanText.prvDelete(numberOfCharactersToDelete, htmlElement, text, i);
        }, ShpanText.delay);
    },

    prvDelete: function(numberOfCharactersToDelete, htmlElement, text, i){
        if (numberOfCharactersToDelete > 0 && htmlElement.innerText.length > 0){
            htmlElement.innerText = htmlElement.innerText.substr(0, htmlElement.innerText.length - 1);
            ShpanText.deleteCharactersAndContinue(numberOfCharactersToDelete - 1, htmlElement, text, i);
        }else if (text != null){
            ShpanText.nextCallback(htmlElement, text, i);
        }
    },

    prvPrint: function(htmlElement, text, i){
        if (i < text.length){
            const nextChar = text.charAt(i);

            var currString = text;
            var subStr = currString.substr(i);
            if (subStr.charAt(0) === '$' &&
                subStr.charAt(1) === '[') {

                // todo: test valid markup
                //if(/^\^\d+/.test(subStr)) {

                switch (subStr.charAt(2)){

                    // Wait
                    case 'w':
                        ShpanText.plugins.pluginWait(htmlElement, text, i);
                        return;

                    // Delete
                    case 'd':
                        ShpanText.plugins.pluginDelete(htmlElement, text, i);
                        return;

                    // External Plugin
                    case 'e':
                        // todo:
                        return;
                }

            }



            htmlElement.innerText += nextChar;
            ShpanText.nextCallback(htmlElement, text, i + 1);
        }
    }


}
