// script.js

document.addEventListener("DOMContentLoaded", () => {
  const toc = document.getElementById("toc");
  const content = document.getElementById("content");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  buildTOC();

  function buildTOC() {
    toc.innerHTML = "";
    TOC.forEach(section => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "toc-section";

      const title = document.createElement("h2");
      title.textContent = section.title;
      sectionDiv.appendChild(title);

      if (section.subtitle) {
        const sub = document.createElement("p");
        sub.className = "subtitle";
        sub.textContent = section.subtitle;
        sectionDiv.appendChild(sub);
      }

      if (section.sections) {
        Object.entries(section.sections).forEach(([group, items]) => {
          const groupHeader = document.createElement("h3");
          groupHeader.textContent = group;
          groupHeader.className = "toc-subheading";
          sectionDiv.appendChild(groupHeader);

          const list = document.createElement("ul");
          items.forEach(item => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.textContent = item;
            btn.onclick = () => { renderContent(section.id, item); maybeCloseTOC(); };
            li.appendChild(btn);
            list.appendChild(li);
          });
          sectionDiv.appendChild(list);
        });
      } else {
        const list = document.createElement("ul");
        section.items.forEach(item => {
          const li = document.createElement("li");
          const btn = document.createElement("button");
          btn.textContent = item;
          btn.onclick = () => { renderContent(section.id, item); maybeCloseTOC(); };
          li.appendChild(btn);
          list.appendChild(li);
        });
        sectionDiv.appendChild(list);
      }

      toc.appendChild(sectionDiv);
    });
  }

  // TOC toggle behavior for narrow screens
  const tocToggle = document.getElementById('tocToggle');
  const tocOverlay = document.getElementById('tocOverlay');

  function openTOC() { document.body.classList.add('toc-open'); tocOverlay.setAttribute('aria-hidden', 'false'); }
  function closeTOC() { document.body.classList.remove('toc-open'); tocOverlay.setAttribute('aria-hidden', 'true'); }
  function maybeCloseTOC() { if (window.matchMedia('(max-width: 900px)').matches) closeTOC(); }

  if (tocToggle) tocToggle.addEventListener('click', () => { if (document.body.classList.contains('toc-open')) closeTOC(); else openTOC(); });
  if (tocOverlay) tocOverlay.addEventListener('click', closeTOC);

  function renderContent(categoryId, itemName) {
    const data = CONTENT?.[categoryId]?.[itemName];
    if (!data) {
      content.innerHTML = `<div class='welcome'><h2>Content coming soon.</h2></div>`;
      return;
    }

    content.innerHTML = `
      <article class="reading">
        <h1>${itemName}</h1>
        <div class="verses">${data.verses.join(" | ")}</div>
        <pre>${data.scripture}</pre>

        <div class="reflection-card">
          <h3>Explanation</h3>
          <p>${data.explanation}</p>
          <h3>Guide Questions</h3>
          <ul>${data.questions.map(q => `<li>${q}</li>`).join("")}</ul>
          <h3>Reflection</h3>
          ${data.reflection ? `<p>“${data.reflection}”</p>` : ''}
          ${data.reflectionQuote ? `<blockquote class="reflection-quote">“${data.reflectionQuote}”</blockquote>` : ''}
          ${data.prayer ? `<h3>Prayer</h3><p class="prayer">${data.prayer}</p>` : ''}
        </div>

      </article>
    `;

    // Auto-close TOC on mobile after rendering content
    maybeCloseTOC();
  }

  function buildWelcome() {
    content.innerHTML = `
      <div class="welcome">
        <h2>Welcome to <span>Guide</span></h2>
        <p>Select a topic to begin reading the Scriptures and reflections.</p>
      </div>`;
  }

  buildWelcome();
});
