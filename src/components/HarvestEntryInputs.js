import React from 'react';
import { InputGroup, FloatingLabel, FormControl, FormSelect } from 'react-bootstrap';
const HarvestEntryInputs = ({ 
    filteredProject, 
    entry, 
    inputValues, 
    handleInputChange, 
    handleTaskChange, 
    filteredTasksArray,
    projectId,
    projectNotes,
    suggestedMinutes,
    spentDate,
    userId
}) => {

    
    return (
        <div key={filteredProject.code} className="entry-form-inputs">
            <h5>{filteredProject.code}</h5>
            <input type="hidden" className="projectId" name="projectId" value={projectId} />
            <input type="hidden" className="projectNotes" name="projectNotes" value={projectNotes} />
            <input type="hidden" className="suggestedMinutes" name="suggestedMinutes" value={suggestedMinutes || 0} />
            <input type="hidden" className="spentDate" name="spentDate" value={spentDate} />
            <input type="hidden" className="userId" name="userId" value={userId} />
            <InputGroup>    
                <FloatingLabel>Confirmed Minutes (suggested minutes: {suggestedMinutes})</FloatingLabel>
                <FormControl
                    type="number"
                    placeholder={suggestedMinutes || 0}
                    required
                    className="confirmed-minutes"
                    value={inputValues[entry.originalEntry.id]?.[filteredProject.code]?.confirmedMinutes || ''}
                    onChange={(e) => handleInputChange(e, entry.originalEntry.id, filteredProject.code, e.target.value)}
                />
            </InputGroup>
            <InputGroup>
                <FloatingLabel>Select Task</FloatingLabel>
                <FormSelect
                    className="task-select"
                    onChange={(e) => handleTaskChange(entry.originalEntry.id, filteredProject.code, e.target.value)}
                    value={inputValues[entry.originalEntry.id]?.[filteredProject.code]?.taskId || ''}
                    required
                >
                    <option value="">Select a task</option>
                    {filteredTasksArray.map(task => (
                        <option key={task.id} value={task.id}>
                            {task.name}
                        </option>
                    ))}
                </FormSelect>
            </InputGroup>
        </div>
    );
};

export default HarvestEntryInputs;