type MultipleChoiceOption = {
    label: string
}

type MultipleChoiceOptions = {
    prompt: string,
    options: Array<MultipleChoiceOption>
}

type ApiKey = string

function getApiKey() : Promise<ApiKey> {
    return new Promise((resolve, reject) => {
        window.addEventListener("message", event => {
            resolve(event.data as string);
        });

        setTimeout(reject, 100);
    })
}

async function main() {
    let apiKey: string = null;
    try {
        apiKey = await getApiKey()
    } catch (error) {
        console.error(`Error retrieving API key: ${error}`);
    }

    let arguments: MultipleChoiceOptions = null;
    try {
        arguments = await (await fetch(`http://localhost:8080/api/${apiKey}/arguments`)).json() as MultipleChoiceOptions;
    } catch (error) {
        console.error(`Error retrieving options: ${error}`);
    }

    const prompt = document.createElement("p");
    prompt.innerText = arguments.prompt;

    const inputElements = arguments.options.map((option, i) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.id = `option-${i}`;
        input.name = "option";
        input.value = option.label;

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerText = option.label;
        return [input, label]
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";

    const form = document.createElement("form");
    form.appendChild(prompt);
    for (const [input, label] of inputElements) {
        form.appendChild(input);
        form.appendChild(label);
    }
    form.appendChild(submitButton);

    form.addEventListener("submit", async event => {
        var data = new FormData(form);
        const response = await fetch(`http://localhost:8080/api/${apiKey}/score`, {
            method: "POST",
            body: JSON.stringify(data)
        });
        if (response.status != 200) {
            form.classList.add("invalid");
        } else {
            form.classList.add("valid");
        }
        event.preventDefault();
        event.stopPropagation();
    });

}