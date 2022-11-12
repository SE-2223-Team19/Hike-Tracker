
/**
 * Constructor function for new Exam objects
 * @param {string} title course code (e.g., '01ABC')
 * @param {number} length course name
 * @param {number} ascent number of credits (e.g. 6)
 * @param {number} scexpectedTimeore score attained at the exam
 * @param {string} difficulty date of the exam, in a format parseable by dayjs()
 * @param {string} description
 
 */
 function Hike(title, length, ascent, scexpectedTimeore, difficulty,description) {
    this.title = title;
    this.length = length;
    this.ascent = ascent;
    this.scexpectedTimeore = scexpectedTimeore;
    this.difficulty = difficulty;
    this.description=description;
}

export default Hike