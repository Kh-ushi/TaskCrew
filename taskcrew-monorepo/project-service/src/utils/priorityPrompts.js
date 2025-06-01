
const getPriorityPrompt = (allProjects) => `
You are an AI assistant tasked with classifying project priorities.

Below is a list of existing projects, each with its ID, name, description, due date, currently assigned priority, and creation date.

${allProjects.map(p => `
ID: ${p._id}
Name: ${p.name}
Description: ${p.description}
Due Date: ${p.dueDate ? p.dueDate.toISOString() : 'No due date'}
Priority: ${p.priority}
Created At: ${p.createdAt.toISOString()}
`).join('\n')}

Your task:
Please output a valid JSON object that maps each project ID to **exactly one** priority value: **"high"**, **"medium"**, or **"low"**.

When deciding priorities, consider:
- The due date (sooner deadlines should have higher priority)
- The creation date (newer tasks may require reevaluation)
- The balance of priorities across all projects (avoid marking everything as "high")

Output format:
{
  "603abc...": "high",
  "603def...": "low"
}
`.trim();


const getPriorityPromptHgFace=(allProjects)=>`
You are an intelligent assistant that classifies project priorities as "high", "medium", or "low".

Input:
${allProjects.map(p => `
ID: ${p._id}
Name: ${p.name}
Description: ${p.description}
Due Date: ${p.dueDate}
Existing Priority: ${p.priority}
Created At: ${p.createdAt}
`).join('\n')}

Output:
A JSON object mapping each project ID to one of: "high", "medium", or "low".
Example:
{
  "1": "high",
  "2": "medium"
}
`;



module.exports = {getPriorityPrompt,getPriorityPromptHgFace};