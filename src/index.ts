import { parseSet } from "./parseSet.ts";

fetch("./generated/sets.json").then(async (response) => {
	if (!response.ok) return;
	const sets = await response.json();
	const fragment = document.createDocumentFragment();
	sets.forEach(({ value, text }) => {
		const option = document.createElement("option");
		option.value = value;
		option.appendChild(document.createTextNode(text));
		if (sets.length === 1) option.selected = true;
		if (sets.length === 1) option.disabled = true;
		fragment.appendChild(option);
	});

	empty("select").appendChild(fragment);
});

document.querySelector("button").addEventListener(
	"click",
	async function start(event: Event) {
		const qNa: Record<"question" | "answer", string>[] = [];
		const button = document.querySelector("button");
		const set =
			(document.querySelector("#set") as HTMLSelectElement)?.value ??
			"albmyx569bmpyy8wqyed08af4mjrltzd";
		const response = await fetch(`./sets/${set}.txt`);
		if (!response.ok) throw new Error("Failed to fetch set. Please reload.");
		const text = await response.text();
		qNa.push(...parseSet(text).qNa);
		const total = qNa.length;
		const displayNextQuestion = () => qNa.length > 0
				? displayQNA(qNa.shift(), [qNa.length + 1, total].join("/"))
				: displayOutOfQuestions();
		button.addEventListener("click", displayNextQuestion, { once: false });
		displayNextQuestion();
		button.textContent = "Next";

		function displayQNA(
			{
				question,
				answer,
			}: {
				question: string;
				answer: string;
			},
			remaining: string,
		): void {
			const fragment = document.createDocumentFragment();
			const questionElement = document.createElement("h1");
			questionElement.appendChild(document.createTextNode(question));
			const answerElement = document.createElement("p");
			answerElement.appendChild(document.createTextNode(answer));
			const remainingElement = document.createElement("p");
			remainingElement.classList.add("small");
			remainingElement.classList.add("center");
			remainingElement.appendChild(
				document.createTextNode(`Remaining: ${remaining}`),
			);
			fragment.appendChild(questionElement);
			fragment.appendChild(answerElement);
			fragment.appendChild(remainingElement);
			empty("section").appendChild(fragment);
		}

		function displayOutOfQuestions(): void {
			const fragment = document.createDocumentFragment();
			const title = document.createElement("h1");
			title.appendChild(document.createTextNode("Out of questions"));
			const paragraph = document.createElement("p");
			paragraph.appendChild(
				document.createTextNode(
					"You have answered all questions. Make up some questions of your own, or ",
				),
			);
			const link = document.createElement("a");
			link.href = "https://github.com/omrilotan/wao/issues/new";
			link.appendChild(document.createTextNode("suggest more questions"));
			paragraph.appendChild(link);
			fragment.appendChild(title);
			fragment.appendChild(paragraph);
			empty("section").appendChild(fragment);

			button.removeEventListener("click", displayNextQuestion);
			button.addEventListener(
				"click",
				() => {
					location.reload();
				},
				{ once: true },
			);
			button.textContent = "Restart";
		}

		return undefined;
	},
	{ once: true },
);

function empty(selector: string): Element {
	const element = document.querySelector(selector);
	while (element.firstChild) element.removeChild(element.firstChild);
	return element;
}
