let truckData = [];

fetch('./data/truck-ports.json')
  .then(response => response.json())
  .then(data => {

    truckData = data;

    const makes = [...new Set(
      data.map(x => x.make)
    )].sort();

    const years = [...new Set(
      data.map(x => x.year)
    )].sort((a, b) => a - b);

    const makeSelect = document.getElementById("make");
    const yearSelect = document.getElementById("year");

    makes.forEach(make => {

      const option = document.createElement("option");

      option.value = make;
      option.textContent = make;

      makeSelect.appendChild(option);

    });

    years.forEach(year => {

      const option = document.createElement("option");

      option.value = year;
      option.textContent = year;

      yearSelect.appendChild(option);

    });

  })
  .catch(error => {
    console.error("Error loading truck data:", error);
  });

document
  .getElementById("searchBtn")
  .addEventListener("click", searchPort);

function searchPort() {

  const make =
    document.getElementById("make").value;

  const year =
    Number(document.getElementById("year").value);

  const result =
    document.getElementById("result");

  if (!make || !year) {

    result.innerHTML = `
      <div class="result-card">
        <h3>Please select a make and year.</h3>
      </div>
    `;

    return;
  }

  const match =
    truckData.find(x =>
      x.make === make &&
      x.year === year
    );

  if (!match) {

    result.innerHTML = `
      <div class="result-card">
        <h3>No matching truck found.</h3>
        <p>Try another make or year.</p>
      </div>
    `;

    return;
  }

  result.innerHTML = `
    <div class="result-card">

      <div class="result-header">

        <h2>${match.year} ${match.make}</h2>

        <span class="port-pill">
          ${match.portType}
        </span>

      </div>

      <div class="result-grid">

        <div class="info-box">

          <div class="info-label">
            Diagnostic Port
          </div>

          <div class="info-value">
            ${match.portType}
          </div>

        </div>

        <div class="info-box">

          <div class="info-label">
            Pin Count
          </div>

          <div class="info-value">
            ${match.pins ?? "Unknown"}
          </div>

        </div>

      </div>

      <div class="recommendation">

        ${
          match.adapterRequired
          ? `
          <div class="recommendation-title">
            Adapter Information
          </div>

          <p>
            Modern ELDs, telematics devices, and scan tools
            typically require a
            <strong>${match.recommendedAdapter}</strong>.
          </p>
          `
          : `
          <div class="recommendation-title">
            Good News
          </div>

          <p>
            This truck uses a standard
            <strong>9-Pin J1939</strong> connector.
            Most modern diagnostic tools connect directly.
          </p>
          `
        }

      </div>

    </div>
  `;
}
