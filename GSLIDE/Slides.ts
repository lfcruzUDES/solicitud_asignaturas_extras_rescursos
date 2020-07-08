namespace SLIDE {


    export function conn(id_url_booK: string): GoogleAppsScript.Slides.Presentation {
        let book;
        if (id_url_booK) {
            if (id_url_booK.indexOf('https://docs.google.com/presentation/') >= 0) {
                book = SlidesApp.openByUrl(id_url_booK);
            } else {
                book = SlidesApp.openById(id_url_booK);
            }
        } else {
            book = SlidesApp.getActivePresentation();
        }
        return book;
    }

}