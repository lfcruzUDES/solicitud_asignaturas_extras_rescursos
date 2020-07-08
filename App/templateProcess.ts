/// <reference path="../Settings.ts" />
/// <reference path="../GSLIDE/Slides.ts" />
/// <reference path="../Models/models.ts" />


namespace TemplateProcess {


    export function make() {
        let responses = Models.ResponsesModel();
        let responses_data = responses.filter({ status: '' })

        let coordinators = Models.NotificationDataModel();
        let coordinators_data = coordinators.all();

        let directors = Models.DirectorsDataModel();
        let directors_data = directors.all();

        let history = Models.HistoryModel();

        let career_info = data_by_career(coordinators_data);

        for (const request of responses_data) {
            let career = request.datas.career.split('(')[1].replace(')', '').trim();
            let marks = data_base_to_marks(request, career, career_info, directors_data);
            let subjects = get_subjects(career, request)
            let full_marks = { ...marks, ...subjects }
            let document = copy_template(`${marks['enrollment']} - ${marks['name']} - ${request.datas.datetime}`);
            template_data_reemplace(document, full_marks)
            history.create({ ...request, url: document.getUrl() });
        }

    }

    /**
     * Crea un objeto con las marcas base a reemplazar en
     * la plantilla de formato.
     * @param request : datos del alumno.
     * @param base_marks: objeto de marcas base.
     */
    function data_base_to_marks(request: {}, career: string, career_info: {}, directors_data: {}[], base_marks = SETTINGS.MARKS) {
        let marks = { ...base_marks }
        marks['name'] = request.datas.name;
        marks['enrollment'] = request.datas.enrollment;
        marks['day'] = request.datas.datetime.getDate();
        marks['month'] = request.datas.datetime.getMonth();
        marks['year'] = request.datas.datetime.getFullYear();
        marks['coordinator'] = career_info[career].coordinator;
        marks['academic_director'] = directors_data[0].datas.name;
        marks['administrative_director'] = directors_data[1].datas.name;

        return marks;
    }

    function data_by_career(datas: {}[]) {
        let obj = {};
        for (const data of datas) {
            obj[data.career] = data
        }

        return obj;
    }

    function get_subjects(career: string, datas: {}) {
        let subjects = {}
        for (const career of SETTINGS.CAREERS_NAMES_SHORT) {
            if (datas[`${career}1`]) {
                for (let i = 0; i < SETTINGS.SUBJECTS_BY_CAREER; i++) {
                    let subject_data = datas[`${career}${i + 1}`].split('-');
                    subjects[`id${i + 1}`] = subject_data[0].trim();
                    subjects[`subject${i + 1}`] = subject_data[1].trim();
                }
            }
        }
        return subjects;
    }

    function copy_template(file_name: string): GoogleAppsScript.Slides.Presentation {
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
}