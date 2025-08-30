import './style.css';

async function displayData(ip: string) {
  const playersElement = document.querySelector("#players")!;
  playersElement.innerHTML = "";

  try {
    const status = document.querySelector<HTMLImageElement>("#status");
    status!.src = `https://api.mcstatus.io/v2/widget/java/${ip}`;

    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`);
    const body = await res.json();

    DeleteAllNonTemplateChildren(playersElement);
    for (const player of body.players.list) {
      const element = InstantiateTemplate(playersElement)

      GetChildWithSelector<HTMLImageElement>(element, "img").src = `https://api.mineatar.io/head/${player.uuid}`;
      GetChildWithSelector<HTMLParagraphElement>(element, "p").innerText = player.name_clean;
    }
  } catch {

  }
}

function GetChildWithSelector<T extends Element>(container: Element, selector: string): T {
  for (const child of container.children) {
    if (child.matches(selector))
      return child as T;
  }
  throw `Could not find child with selector ${selector}`
}

function InstantiateTemplate(container: Element) {
  const template = GetTemplateChild(container);
  const element = template.cloneNode(true);
  container.appendChild(element);
  return element as Element;
}

function DeleteAllNonTemplateChildren(containerElement: Element): void {
  while (true) {
    const child = GetFirstNonTemplateChild(containerElement);
    if (!child)
      return;

    containerElement.removeChild(child);
  }
}

function GetTemplateChild(containerElement: Element): Element {
  for (const child of containerElement.children) {
    if (child.classList.contains("template")) {
      return child;
    }
  }

  throw "Could not find template"
}

function GetFirstNonTemplateChild(containerElement: Element) {
  for (const child of containerElement.children) {
    if (!child.classList.contains("template")) {
      return child;
    }
  }

  return undefined;
}


window.addEventListener('DOMContentLoaded', async function () {
  const ipInputElement = document.querySelector<HTMLInputElement>("#ipInput")!;
  ipInputElement.value = "199.115.73.219:9130";

  displayData(ipInputElement.value)

  ipInputElement.addEventListener("input", (args) => {
    displayData(ipInputElement.value)
  })
});