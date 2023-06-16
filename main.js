const activeFilterList = [
  {
    name: "Districts",
    id: 0,
  },
];
document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.querySelector(".list-container .list-group");
  const listFilter = document.querySelector(".list-filter");
  const listGroupSearch = document.querySelector(".list-group-search");

  // search filter
  listGroupSearch.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();

    // if searchString is empty
    if (searchString == "") {
      if (activeFilterList.length === 1) {
        renderList(demoData.districts, listContainer);
        renderBreadcrumb(activeFilterList, listFilter);
      }
      if (activeFilterList.length === 2) {
        //districts filter
        const districts = demoData.districts.find(
          (district) => district.id === activeFilterList[1].id
        );
        renderList(districts.policeStations, listContainer);
        renderBreadcrumb(activeFilterList, listFilter);
      }
      if (activeFilterList.length === 3) {
        //districts filter
        const districts = demoData.districts.find(
          (district) => district.id ===  activeFilterList[1].id
        );
        //policeStations filter
        const policeStations = districts.policeStations.find(
          (policeStation) => policeStation.id === activeFilterList[2].id
        );
        const areaList = policeStations.area.map((area) => {
          return {
            ...area,
            policestation: activeFilterList[1].name + ", " + activeFilterList[2].name,
          };
        });
        renderTable(areaList, listContainer);
        renderBreadcrumb(activeFilterList, listFilter);
      }
    } else {
      //  Search districts, policestations, area
      const searchList = [];
      demoData.districts.forEach((district) => {
        if (district.policeStations.length > 0) {
          district.policeStations.forEach((policeStation) => {
            if (policeStation.area.length > 0) {
              policeStation.area.forEach((area) => {
                if (
                  area.name.toLowerCase().includes(searchString) ||
                  policeStation.name.toLowerCase().includes(searchString) ||
                  district.name.toLowerCase().includes(searchString)
                ) {
                  searchList.push({
                    ...area,
                    policestation: policeStation.name + ", " + district.name,
                  });
                }
              });
            }
          });
        }
      });
      renderTable(searchList, listContainer);
    }
  });

  // aria table render
  const renderTable = (list, container) => {
    container.innerHTML = "";
    const table = document.createElement("table");
    table.className = "table table-bordered";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerText = "Area";
    const th2 = document.createElement("th");
    th2.scope = "col";
    th2.innerText = "Policestation";
    tr.appendChild(th1);
    tr.appendChild(th2);
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    list.forEach((item) => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.scope = "row";
      td1.innerText = item.name || "";
      const td2 = document.createElement("td");
      td2.innerText = item.policestation || "";
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });

    // list not found
    if (list.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 2;
      td.innerText = "Data not found";
      td.classList.add("text-center");
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
  };

  // breadcrumb render
  const renderBreadcrumb = (list, container) => {
    container.innerHTML = "";
    listGroupSearch.value = "";
    const breadcrumb = document.createElement("nav");
    breadcrumb.setAttribute("aria-label", "breadcrumb");
    const ol = document.createElement("ol");
    ol.className = "breadcrumb";
    list.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "breadcrumb-item";
      li.innerText = item.name;
      // Add onclick event to the list item
      li.onclick = () => {
        if (idx === 0) {
          activeFilterList.splice(1);
          renderList(demoData.districts, listContainer);
          renderBreadcrumb(activeFilterList, listFilter);
        }
        if (idx === 1) {
          activeFilterList.splice(2);
          //districts filter
          const districts = demoData.districts.find(
            (district) => district.id === item.id
          );
          renderList(districts.policeStations, listContainer);
          renderBreadcrumb(activeFilterList, listFilter);
        }
        if (idx === 2) {
          activeFilterList.splice(3);
          //districts filter
          const districts = demoData.districts.find(
            (district) => district.id === activeFilterList[1].id
          );
          //policeStations filter
          const policeStations = districts.policeStations.find(
            (policeStation) => policeStation.id === item.id
          );
          const areaList = policeStations.area.map((area) => {
            return {
              ...area,
              policestation: activeFilterList[1].name + ", " + activeFilterList[2].name,
            };
          });

          renderTable(areaList, listContainer);
          renderBreadcrumb(activeFilterList, listFilter);
        }
      };

      ol.appendChild(li);
    });
    breadcrumb.appendChild(ol);
    container.appendChild(breadcrumb);
  };

  const renderList = (list, container) => {
    container.innerHTML = "";
    const listItems = list.map((item) => {
      const listItem = document.createElement("li");
      listItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      listItem.innerText = item.name;

      // Add onclick event to the list item
      listItem.onclick = () => {
        if (activeFilterList.length === 2) {
          activeFilterList[2] = item;
          const areaList = item.area.map((area) => {
            return {
              ...area,
              policestation: activeFilterList[1].name + ", " + item.name,
            };
          });
          renderTable(areaList, listContainer);
          renderBreadcrumb(activeFilterList, listFilter);
        } else {
          if (activeFilterList.length === 1) {
            activeFilterList[1] = item;
            renderList(item.policeStations, listContainer);
            renderBreadcrumb(activeFilterList, listFilter);
          }
        }
      };

      return listItem;
    });
    // Append the list items to the container
    listItems.forEach((listItem) => {
      container.appendChild(listItem);
    });
  };
  // renderList appent to listContainer
  renderList(demoData.districts, listContainer);
  renderBreadcrumb(activeFilterList, listFilter);
});
