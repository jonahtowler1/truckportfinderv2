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
    )].sort((a,b)=>a-b);

    const makeSelect = document.getElementById("make");
    const yearSelect = document.getElementById("year");

    makes.forEach(make => {

      let option = document.createElement("option");

      option.value = make;
      option.textContent = make;

      makeSelect.appendChild(option);

    });

    years.forEach(year => {

      let option = document.createElement("option");

      option.value = year;
      option.textContent = year;

      yearSelect.appendChild(option);

    });

  });

document
.getElementById("searchBtn")
.addEventListener("click", searchPort);

function searchPort(){

    const make =
      document.getElementById("make").value;

    const year =
      Number(document.getElementById("year").value);

    const match =
      truckData.find(x =>
        x.make === make &&
        x.year === year
      );

    const result =
      document.getElementById("result");

    if(!match){

        result.innerHTML = `
        <div class="result-card">
          No matching truck found.
        </div>
        `;

        return;
    }

    result.innerHTML = `
    <div class="result-card">

      <h2>${match.year} ${match.make}</h2>

      <div class="port-badge">
        ${match.portType}
      </div>

      <p><strong>Pins:</strong>
      ${match.pins ?? "Unknown"}</p>

      <br>

      <p>
      ${match.adapterRequired
        ? `Modern diagnostic tools may require a ${match.recommendedAdapter} adapter.`
        : `No adapter is typically required.`
      }
      </p>

    </div>
    `;
}
