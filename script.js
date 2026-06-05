let truckData = [];

fetch('./data/truck-ports.json')
  .then(response => response.json())
  .then(data => {

    truckData = data;

    const makes = [...new Set(
      data.map(item => item.make)
    )].sort();

    const years = [...new Set(
      data.map(item => item.year)
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
    truckData.find(item =>
      item.make === make &&
      item.year === year
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

      <div class="result-top">

        <div>

          <div class="truck-title">
            ${match.year} ${match.make}
          </div>

          <div class="truck-subtitle">
            Diagnostic Port Information
          </div>

        </div>

        <div class="port-tag">
          ${match.portType}
        </div>

      </div>

      <div class="detail-row">

        <span>Port Type</span>

        <strong>
          ${match.portType}
        </strong>

      </div>

      <div class="detail-row">

        <span>Pin Count</span>

        <strong>
          ${match.pins ?? "Unknown"}
        </strong>

      </div>

      <div class="recommendation-box">

        ${
          match.adapterRequired
          ? `
            <strong>Adapter Recommendation</strong>

            <p>
              Most modern ELDs, telematics systems,
              and scan tools require a
              <strong>${match.recommendedAdapter}</strong>.
            </p>
          `
          : `
            <strong>No Adapter Needed</strong>

            <p>
              This truck uses a standard
              9-Pin J1939 diagnostic connector.
            </p>
          `
        }

      </div>

    </div>
  `;
}
