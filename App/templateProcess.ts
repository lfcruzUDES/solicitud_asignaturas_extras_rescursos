/// <reference path="../Settings.ts" />
/// <reference path="../GSLIDE/Slides.ts" />
/// <reference path="../Models/models.ts" />


namespace TemplateProcess {

    function create_copy_template(file_name: string): GoogleAppsScript.Slides.Presentation {
        let folder = DriveApp.getFolderById(SETTINGS.FOLDER_FORMATS_FILLED);
        let document = DriveApp.getFileById(SETTINGS.FORMAT_TEMPLATE_ID).makeCopy(file_name, folder);
        return SLIDE.conn(document.getId());
    }

    function template_data_reemplace(doc: GoogleAppsScript.Slides.Presentation, data: {}): GoogleAppsScript.Slides.Presentation {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                doc.replaceAllText(`##${key}##`, String(value));
            }
        }

        return doc;
    }

    function obj_data_marks() {
        let obj = { ...SETTINGS.MARKS };
        for (let i = 0; i < SETTINGS.SUBJECTS_BY_CAREER; i++) {
            obj[`id${i + 1}`] = '';
            obj[`subject${i + 1}`] = '';
        }

        return obj;
    }
}