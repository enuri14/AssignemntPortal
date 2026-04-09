import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import type { Assignment, Notebook } from "../types";
import { fetchAssignmentById } from "../api";

const AssignmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] =
    useState<Assignment["status"] | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchAssignmentById(id);
        setAssignment(data);

        //LOAD saved status
        const savedStatus = localStorage.getItem(
          `assignment-status-${data?.id}`
        );

        if (savedStatus) {
          setLocalStatus(savedStatus as Assignment["status"]);
        } else {
          setLocalStatus(data?.status ?? null);
        }

      } catch (e) {
        console.error(e);
        setError("Could not load assignment.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleViewNotebook = (nb: Notebook) => {
    window.open(nb.viewUrl, "_blank", "noopener,noreferrer");
  };

  /* DOWNLOAD HANDLER */
  const handleDownloadAssignment = async () => {
    if (!assignment) return;

    const url = `${window.location.origin}/exchange/${assignment.courseId}/release/${assignment.id}.zip`;

    try {
      const response = await fetch(url, { method: "HEAD" });

      if (!response.ok) {
        alert("Assignment not released yet.");
        return;
      }

      window.open(url, "_blank");

      setLocalStatus("Downloaded");

      localStorage.setItem(
        `assignment-status-${assignment.id}`,
        "Downloaded"
      );

    } catch {
      alert("Unable to download assignment.");
    }
  };

  /* ✅ POLISHED SUBMIT HANDLER */
  const handleSubmitAssignment = (files: FileList) => {
    if (!assignment) return;

    const now = new Date().toISOString();

    setAssignment({
      ...assignment,
      submittedDate: now
    });

    setLocalStatus("Submitted");

    localStorage.setItem(
      `assignment-status-${assignment.id}`,
      "Submitted"
    );

    alert("Assignment submitted successfully!");
  };

  if (loading) return <div className="info-box">Loading assignment…</div>;

  if (error || !assignment)
    return (
      <div className="info-box error">
        {error ?? "Assignment not found."}
        <button className="primary-btn" onClick={() => history.goBack()}>
          Go back
        </button>
      </div>
    );

  return (
    <section className="assignment-details">
      <Link to="/" className="back-link">← Back to assignments</Link>

      <header className="details-header">
        <h1>{assignment.title}</h1>
        <span
          className={`status-pill status-${(
            localStatus ?? assignment.status
          ).toLowerCase()}`}
        >
          {localStatus ?? assignment.status}
        </span>
      </header>

      <div className="meta-band">
        <div className="meta-item">
          <div className="meta-label">Release</div>
          <div className="meta-value">
            {assignment.releaseDate
              ? new Date(assignment.releaseDate).toLocaleString()
              : "—"}
          </div>
        </div>

        <div className="meta-item">
          <div className="meta-label">Due</div>
          <div className="meta-value">
            {assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleString()
              : "—"}
          </div>
        </div>
      </div>

      <section className="details-section">
        <h2>Allocated notebooks</h2>

        {assignment.notebooks.length === 0 ? (
          <div className="empty-state">No notebooks allocated.</div>
        ) : (
          <table className="notebook-table">
            <tbody>
              {assignment.notebooks.map(nb => (
                <tr key={nb.id}>
                  <td>{nb.name}</td>
                  <td>{nb.type}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewNotebook(nb)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="download-all-btn"
          onClick={handleDownloadAssignment}
          disabled={
            localStatus === "Downloaded" ||
            localStatus === "Submitted"
          }
        >
          Download package + notebooks
        </button>
      </section>

      <section className="details-section">
        <h2>Submit assignment</h2>

        {localStatus === "Submitted" ? (
          <div>
            Submitted on{" "}
            {assignment.submittedDate
              ? new Date(assignment.submittedDate).toLocaleString()
              : "Just now"}
          </div>
        ) : (
          <div>
            <input type="file" multiple id="submit-files" />
            <button
              className="primary-btn"
              onClick={() => {
                const input = document.getElementById("submit-files") as HTMLInputElement;

                if (input.files && input.files.length > 0) {
                  handleSubmitAssignment(input.files);
                } else {
                  alert("Please select files to submit");
                }
              }}
            >
              Submit assignment
            </button>
          </div>
        )}
      </section>
    </section>
  );
};

export default AssignmentDetailsPage;