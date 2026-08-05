document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM Elements
    const filterContainer = document.getElementById("filter");
    const filterWrapper = document.querySelector(".filter");
    const cards = document.querySelectorAll(".card");

    // 2. State to hold active filter tags
    const activeTags = new Set();

    // Initially hide the filter bar if no tags are selected
    toggleFilterBar();

    // 3. Event Delegation for Tag Clicks inside Cards
    document.addEventListener("click", (e) => {
        // Check if the clicked element is a card tag button
        if (e.target.classList.contains("tag") && !e.target.closest(".filteration")) {
            const tagValue = e.target.textContent.trim();

            // Add to active set if not already present
            if (!activeTags.has(tagValue)) {
                activeTags.add(tagValue);
                updateUI();
            }
        }
    });

    // 4. Update Filter Bar and Filter Cards
    function updateUI() {
        renderFilterTags();
        filterCards();
        toggleFilterBar();
    }

    // 5. Render Active Filter Tags in the Header/Filter Bar
    function renderFilterTags() {
        filterContainer.innerHTML = "";

        activeTags.forEach((tagText) => {
            const tagElement = document.createElement("div");
            tagElement.className = "filter-item";
            tagElement.innerHTML = `
        <span class="filter-name">${tagText}</span>
        <button class="remove-tag-btn" data-tag="${tagText}">
          <i class="fa fa-times"></i>
        </button>
      `;

            // Remove tag click event
            tagElement.querySelector(".remove-tag-btn").addEventListener("click", () => {
                activeTags.delete(tagText);
                updateUI();
            });

            filterContainer.appendChild(tagElement);
        });

        // Add 'Clear All' button if there are active filters
        if (activeTags.size > 0) {
            const clearBtn = document.createElement("button");
            clearBtn.className = "clear-btn";
            clearBtn.textContent = "Clear";
            clearBtn.addEventListener("click", () => {
                activeTags.clear();
                updateUI();
            });
            filterContainer.appendChild(clearBtn);
        }
    }

    // 6. Filter Cards based on Active Tags (AND Logic)
    function filterCards() {
        cards.forEach((card) => {
            // Get all tag texts for this specific card
            const cardTags = Array.from(card.querySelectorAll(".card__tags .tag")).map(
                (btn) => btn.textContent.trim()
            );

            if (activeCategoriesEmpty()) {
                card.style.display = "";
            } else {
                // Card must match ALL selected active tags
                const matchesAll = Array.from(activeTags).every((tag) =>
                    cardTags.includes(tag)
                );

                card.style.display = matchesAll ? "" : "none";
            }
        });
    }

    function activeCategoriesEmpty() {
        return activeTags.size === 0;
    }

    // 7. Toggle Filter Bar visibility
    function toggleFilterBar() {
        if (filterWrapper) {
            filterWrapper.style.display = activeTags.size > 0 ? "block" : "none";
        }
    }
});