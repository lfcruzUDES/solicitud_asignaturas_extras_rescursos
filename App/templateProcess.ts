/// <reference path="../Settings.ts" />
/// <reference path="../GSLIDE/Slides.ts" />
/// <reference path="../Models/models.ts" />
/// <reference path="./notification.ts" />



namespace TemplateProcess {

    /**
     * Realiza todo el proceso de creación y llenado del
     * formato de solicitud de asignaturas, también envía
     * un correo de notificación al coordinador que corresponda.
     */
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
            let career_name = request.datas.career.split('(')[1].replace(')', '').trim();
            let career_data = career_info[career_name];
            let marks = data_base_to_marks(request, career_data, directors_data);
            let subjects = get_subjects(career_name, request.datas);
            let full_marks = { ...marks, ...subjects };
            let document = copy_template(`${marks['enrollment']} - ${marks['name']} - ${request.datas.datetime}`);
            let history_data = { ...request.datas, url: document.getUrl() }
            template_data_reemplace(document, full_marks)
            history.create(history_data);
            SEND.noti(career_data.email, history_data);
            request.datas.status = true;
            request.save();
        }

    }

    /**
     * Crea un objeto en donde cada llave es el nombre corto
     * de una carrera, y su valor es un objeto con los datos
     * de la hoja de coordinadores.
     * @param coordinators_data : datos de la hoja de coordinadores.
     */
    function data_by_career(coordinators_data: {}[]) {
        let obj = {};
        for (const coordinator of coordinators_data) {
            obj[coordinator.datas.career] = coordinator.datas
        }

        return obj;
    }

    /**
     * Crea un objeto con las marcas base a reemplazar en
     * la plantilla de formato.
     * @param request : datos del alumno.
     * @param base_marks: objeto de marcas base.
     */
    function data_base_to_marks(request: {}, career_data: {}, directors_data: {}[], base_marks = SETTINGS.MARKS) {
        let marks = { ...base_marks }
        marks['name'] = request.datas.name;
        marks['enrollment'] = request.datas.enrollment;
        marks['day'] = request.datas.datetime.getDate();
        marks['month'] = request.datas.datetime.getMonth();
        marks['year'] = request.datas.datetime.getFullYear();
        marks['coordinator'] = career_data.coordinator;
        marks['academic_director'] = directors_data[0].datas.name;
        marks['administrative_director'] = directors_data[1].datas.name;

        return marks;
    }

    /**
     * Crea un objeto con los id y nombres de las materias,
     * dependiendo de la carrera a la que pertenezca el alumno.
     * @param career : nombre de la carrera.
     * @param datas : datos de la hoja de respuestas.
     */
    function get_subjects(career: string, datas: {}) {
        let subjects = {}
        for (const career of SETTINGS.CAREERS_NAMES_SHORT) {
            if (datas[`${career}1`]) {
                for (let i = 0; i < SETTINGS.SUBJECTS_BY_CAREER; i++) {
                    let subject_data = <[]>datas[`${career}${i + 1}`].split('-');
                    if (subject_data.length > 1) {
                        subjects[`id${i + 1}`] = subject_data[0] ? subject_data[0].trim() : '';
                        subjects[`subject${i + 1}`] = subject_data[1] ? subject_data[1].trim() : '';
                    } else {
                        subjects[`id${i + 1}`] = '';
                        subjects[`subject${i + 1}`] = subject_data[0] ? subject_data[0].trim() : '';
                    }
                }
            }
        }
        return subjects;
    }

    /**
     * Hace una copia de la plantilla del formato de
     * solicitud de asignaturas.
     * @param file_name : Nombre del nuevo documento.
     */
    function copy_template(file_name: string): GoogleAppsScript.Slides.Presentation {
        let folder = DriveApp.getFolderById(SETTINGS.FOLDER_FORMATS_FILLED);
        let document = DriveApp.getFileById(SETTINGS.FORMAT_TEMPLATE_ID).makeCopy(file_name, folder);
        return SLIDE.conn(document.getId());
    }

    /**
     *  Reemplaza los marcadores del documento.
     * @param doc : copia de la plantilla de solicitud de asignaturas.
     * @param data : objeto con marcadores a reemplazar en el documento.
     */
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