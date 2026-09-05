document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const projectList = document.getElementById("projectList");
  const projectPreview = document.getElementById("projectPreview");
  const projectPreviewImg = document.getElementById("projectPreviewImg");
  const projectDetail = document.getElementById("projectDetail");
  const projectDetailClose = document.getElementById("projectDetailClose");
  const detailHeroImg = document.getElementById("detailHeroImg");
  const detailTitle = document.getElementById("detailTitle");
  const detailDesc = document.getElementById("detailDesc");
  const detailMeta = document.getElementById("detailMeta");
  const detailChallenge = document.getElementById("detailChallenge");
  const detailSolution = document.getElementById("detailSolution");
  const detailOutcome = document.getElementById("detailOutcome");
  const detailLinks = document.getElementById("detailLinks");
  const prevProject = document.getElementById("prevProject");
  const nextProject = document.getElementById("nextProject");
  const backToWork = document.getElementById("backToWork");

  if (!projectList) return;

  const rows = [...projectList.querySelectorAll(".project-row")];
  let currentProjectIndex = 0;
  let previouslyFocusedElement = null;

  function projectFromRow(row) {
    return row?.dataset || null;
  }

  function setProjectImage(imageElement, project) {
    if (!imageElement || !project) return;

    const imagePath = project.projectImage;
    const fallbackPaths = [
      imagePath,
      `project-1/${imagePath}`,
      imagePath.replace(/\.webp$/i, ".png"),
      `project-1/${imagePath.replace(/\.webp$/i, ".png")}`,
    ];
    let imagePathIndex = 0;

    imageElement.onerror = () => {
      imagePathIndex += 1;
      if (imagePathIndex < fallbackPaths.length) {
        imageElement.src = fallbackPaths[imagePathIndex];
      }
    };
    imageElement.src = fallbackPaths[imagePathIndex];
    imageElement.alt = project.projectName;
  }

  function trapFocus(modal) {
    previouslyFocusedElement = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    const focusable = modal.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) return;
    first.focus();

    modal._projectFocusHandler = (event) => {
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    modal.addEventListener("keydown", modal._projectFocusHandler);
  }

  function releaseFocus(modal) {
    if (modal._projectFocusHandler) {
      modal.removeEventListener("keydown", modal._projectFocusHandler);
      delete modal._projectFocusHandler;
    }
    modal.setAttribute("aria-hidden", "true");
    previouslyFocusedElement?.focus?.();
  }

  function openProjectDetail(index) {
    const project = projectFromRow(rows[index]);
    if (!project || !projectDetail) return;

    currentProjectIndex = index;
    setProjectImage(detailHeroImg, project);
    if (detailTitle) detailTitle.textContent = project.projectName;
    if (detailDesc) detailDesc.textContent = project.projectDescription;
    if (detailMeta) {
      detailMeta.innerHTML = `
        <div><div class="project-meta-label">Year</div><div class="project-meta-value">${project.projectYear}</div></div>
        <div><div class="project-meta-label">Role</div><div class="project-meta-value">${project.projectRole}</div></div>
        <div><div class="project-meta-label">Technologies</div><div class="project-meta-value">${project.projectTech}</div></div>
      `;
    }
    if (detailChallenge) detailChallenge.textContent = project.projectChallenge;
    if (detailSolution) detailSolution.textContent = project.projectSolution;
    if (detailOutcome) detailOutcome.textContent = project.projectOutcome;
    if (detailLinks) {
      detailLinks.innerHTML = `
        <a href="${project.projectLive}" target="_blank" rel="noopener noreferrer" class="project-link"><span>Live Demo ↗</span></a>
        <a href="${project.projectGithub}" target="_blank" rel="noopener noreferrer" class="project-link"><span>Source Code ↗</span></a>
      `;
    }

    document.documentElement.classList.add("no-scroll");
    projectDetail.classList.add("active");
    projectDetail.scrollTop = 0;
    trapFocus(projectDetail);
  }

  function closeProjectDetail() {
    if (!projectDetail) return;
    projectDetail.classList.remove("active");
    document.documentElement.classList.remove("no-scroll");
    releaseFocus(projectDetail);
  }

  rows.forEach((row, index) => {
    const project = projectFromRow(row);
    row.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-project");
      setProjectImage(projectPreviewImg, project);
      projectPreview?.classList.add("visible");
    });
    row.addEventListener(
      "mousemove",
      (event) => {
        if (projectPreview) {
          projectPreview.style.transform = `translate3d(${event.clientX + 35}px, ${event.clientY - 120}px, 0)`;
        }
      },
      { passive: true },
    );
    row.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-project");
      projectPreview?.classList.remove("visible");
    });
    row.addEventListener("click", () => openProjectDetail(index));
    row
      .querySelector(".project-source-link")
      ?.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProjectDetail(index);
      }
    });
  });

  projectDetailClose?.addEventListener("click", closeProjectDetail);
  backToWork?.addEventListener("click", (event) => {
    event.preventDefault();
    closeProjectDetail();
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  });
  prevProject?.addEventListener("click", () => {
    openProjectDetail((currentProjectIndex - 1 + rows.length) % rows.length);
  });
  nextProject?.addEventListener("click", () => {
    openProjectDetail((currentProjectIndex + 1) % rows.length);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectDetail?.classList.contains("active")) {
      closeProjectDetail();
    }
  });
});
