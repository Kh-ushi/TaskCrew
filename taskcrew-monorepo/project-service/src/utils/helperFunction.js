
async function classifyPrioritiesOpenAI(prompt) {
    let aiMapping = {};

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.0,
        });

        const rawText = completion.choices[0].message.content.trim();
        console.log('Raw AI response:', rawText);

        try {
            aiMapping = JSON.parse(rawText);
        } catch (jsonErr) {
            console.warn('Invalid JSON from OpenAI. Falling back to default.');
            allProjects.forEach((p) => {
                aiMapping[p._id] = 'medium';
            });
        }

        console.log('AI Mapping:', aiMapping);

    } catch (aiErr) {
        console.error(
            'OpenAI error. Falling back to default “medium” for all.',
            aiErr.message || ''
        );

    }
}



module.exports={classifyPrioritiesOpenAI};