import React, { useState, useEffect, useRef } from "react";

const Problem2 = () => {
  const [showModalA, setShowModalA] = useState(false);
  const [showModalB, setShowModalB] = useState(false);
  const [showModalC, setShowModalC] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onlyEven, setOnlyEven] = useState(false); // Added state for checkbox
  const modalRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (showModalA || showModalB) {
      // Reset the scroll position when modal is shown
      modalRef.current.scrollTop = 0;
    }
  }, [showModalA, showModalB]);

  const fetchContacts = async (page = 1, country = null) => {
    try {
      const url = country
        ? `https://contact.mediusware.com/api/country-contacts/${country}/?page=${page}`
        : `https://contact.mediusware.com/api/contacts/?page=${page}`;

      setIsLoading(true);

      const response = await fetch(url);
      const data = await response.json();

      if (page === 1) {
        setContacts(data.results);
        setFilteredContacts(data.results);
      } else {
        setContacts((prevContacts) => [...prevContacts, ...data.results]);
        setFilteredContacts((prevFilteredContacts) => [
          ...prevFilteredContacts,
          ...data.results,
        ]);
      }

      setCurrentPage(page);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setIsLoading(false);
    }
  };

  const openModalA = () => {
    setShowModalA(true);
    setShowModalB(false); // Close Modal B
    setSelectedContact(null); // Reset selected contact
    fetchContacts(1); // Fetch first page of contacts

    // Change the URL without causing a page reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("modal", "A");
    window.history.pushState(null, "", newUrl);
  };

  const openModalB = () => {
    setShowModalB(true);
    setShowModalA(false); // Close Modal A
    setSelectedContact(null); // Reset selected contact
    fetchContacts(1, "United States"); // Fetch first page of contacts for the US

    // Change the URL without causing a page reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("modal", "B");
    window.history.pushState(null, "", newUrl);
  };

  const openModalC = (contact) => {
    setSelectedContact(contact);
    setShowModalC(true);
  };

  const closeModalA = () => {
    setShowModalA(false);

    // Remove the modal parameter from the URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("modal");
    window.history.pushState(null, "", newUrl);
  };

  const closeModalB = () => {
    setShowModalB(false);

    // Remove the modal parameter from the URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("modal");
    window.history.pushState(null, "", newUrl);
  };

  const closeModalC = () => {
    setShowModalC(false);
  };

  useEffect(() => {
    // Filter contacts based on search input and even IDs
    const filterContacts = () => {
      let filtered = contacts.filter((contact) =>
        contact?.country.name.toLowerCase().includes(searchInput.toLowerCase())
      );

      if (onlyEven) {
        filtered = filtered.filter((contact) => contact.id % 2 === 0);
      }

      setFilteredContacts(filtered);
    };

    const delay = setTimeout(filterContacts, 300);

    return () => clearTimeout(delay);
  }, [searchInput, contacts, onlyEven]);

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      const filtered = contacts.filter((contact) =>
        contact?.country.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const handleScroll = () => {
    if (
      !isLoading &&
      modalRef.current &&
      modalRef.current.scrollTop + modalRef.current.clientHeight >=
        modalRef.current.scrollHeight
    ) {
      const nextPage = currentPage + 1;
      fetchContacts(nextPage);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={openModalA}
            style={{ color: "#46139f" }}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={openModalB}
            style={{ color: "#ff7f50" }}
          >
            US Contacts
          </button>
        </div>
      </div>

      {showModalA && (
        <div
          className="modal show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
              ref={modalRef}
              onScroll={handleScroll}
            >
              <div
                className="modal-header"
                style={{ background: "#46139f", color: "#ffffff" }}
              >
                <h5 className="modal-title">Modal A</h5>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyUp={handleSearchKeyUp}
                  placeholder="Search contacts..."
                />
              </div>
              <div className="modal-body">
                <ul>
                  {filteredContacts.map((contact) => (
                    <li
                      key={contact.id}
                      onClick={() => openModalC(contact)}
                      style={{ cursor: "pointer" }}
                    >
                      {contact?.country.name}
                    </li>
                  ))}
                  {isLoading && <li>Loading...</li>}
                </ul>
              </div>
              <div className="modal-footer">
                <label>
                  <input
                    type="checkbox"
                    checked={onlyEven}
                    onChange={() => setOnlyEven(!onlyEven)}
                  />
                  Only even
                </label>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openModalA}
                  style={{ color: "#46139f" }}
                >
                  All Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={openModalB}
                  style={{ color: "#ff7f50" }}
                >
                  US Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={closeModalA}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalB && (
        <div
          className="modal show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
              ref={modalRef}
              onScroll={handleScroll}
            >
              <div
                className="modal-header"
                style={{ background: "#ff7f50", color: "#ffffff" }}
              >
                <h5 className="modal-title">Modal B</h5>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyUp={handleSearchKeyUp}
                  placeholder="Search contacts..."
                />
              </div>
              <div className="modal-body">
                <ul>
                  {filteredContacts.map((contact) => (
                    <li
                      key={contact.id}
                      onClick={() => openModalC(contact)}
                      style={{ cursor: "pointer" }}
                    >
                      {contact?.country.name}
                    </li>
                  ))}
                  {isLoading && <li>Loading...</li>}
                </ul>
              </div>
              <div className="modal-footer">
                <label>
                  <input
                    type="checkbox"
                    checked={onlyEven}
                    onChange={() => setOnlyEven(!onlyEven)}
                  />
                  Only even
                </label>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openModalA}
                  style={{ color: "#46139f" }}
                >
                  All Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={openModalB}
                  style={{ color: "#ff7f50" }}
                >
                  US Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={closeModalB}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalC && selectedContact && (
        <div
          className="modal show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "#46139f", color: "#ffffff" }}
              >
                <h5 className="modal-title">Modal C</h5>
              </div>
              <div className="modal-body">
                <p>Contact Details:</p>
                <p>ID: {selectedContact?.id}</p>
                <p>Country Name: {selectedContact?.country.name}</p>
                <p>Phone: {selectedContact?.phone}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={closeModalC}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem2;
