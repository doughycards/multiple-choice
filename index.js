var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getApiKey() {
    return new Promise((resolve, reject) => {
        window.addEventListener("message", event => {
            resolve(event.data);
        });
        setTimeout(reject, 100);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let apiKey = null;
        try {
            apiKey = yield getApiKey();
        }
        catch (error) {
            console.error(`Error retrieving API key: ${error}`);
        }
        let arguments = null;
        try {
            arguments = (yield (yield fetch(`http://localhost:8080/api/${apiKey}/arguments`)).json());
        }
        catch (error) {
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
            return [input, label];
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
        form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            var data = new FormData(form);
            const response = yield fetch(`http://localhost:8080/api/${apiKey}/score`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            if (response.status != 200) {
                form.classList.add("invalid");
            }
            else {
                form.classList.add("valid");
            }
            event.preventDefault();
            event.stopPropagation();
        }));
    });
}
