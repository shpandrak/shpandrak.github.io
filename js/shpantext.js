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

                switch (subStr.charAt(2)){

                    // Wait
                    case 'w':
                        var skip = 5;  // skip at least 5
                        var charPause = 0;
                        subStr = /\d+/.exec(subStr)[0];
                        skip += subStr.length;
                        charPause = parseInt(subStr);
                        window.setTimeout(function(){
                            ShpanText.nextCallback(htmlElement, text, i + skip);
                        }, charPause);
                        return;

                    // Delete
                    case 'd':
                        var skip = 5;  // skip at least 5
                        var charactersToRemove = 0;
                        subStr = /\d+/.exec(subStr)[0];
                        skip += subStr.length;
                        charactersToRemove = parseInt(subStr);
                        ShpanText.deleteCharactersAndContinue(charactersToRemove, htmlElement, text, i + skip);
                        return;
                }

                // todo: test valid markup
                //if(/^\^\d+/.test(subStr)) {



            }



            htmlElement.innerText += nextChar;
            ShpanText.nextCallback(htmlElement, text, i + 1);
        }
    }


}
