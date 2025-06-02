import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { seekerProfile } from "../services/seekerApi";

const educationLevels = {
    high_school: "High School",
    undergraduate: "Undergraduate",
    graduate: "Graduate",
    postgraduate: "Postgraduate",
};

const financialLevels = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

function UserProfile() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user || !user.accessToken) {
                    setLoading(false);
                    return;
                }
                const response = await seekerProfile({ 
                    accessToken: user.accessToken 
                });
                if (response.status !== 200) {
                    throw new Error("Failed to fetch profile");
                }
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found.</div>;

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
            <h2>User Profile</h2>
            <table style={{ width: "100%", borderSpacing: 8 }}>
                <tbody>
                    <tr>
                        <td><b>Seeker ID:</b></td>
                        <td>{profile.seeker_id}</td>
                    </tr>
                    <tr>
                        <td><b>Current Education Level:</b></td>
                        <td>{educationLevels[profile.current_education_level] || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Field of Study:</b></td>
                        <td>{profile.field_of_study || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>GPA:</b></td>
                        <td>{profile.gpa || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Target Degree:</b></td>
                        <td>{profile.target_degree || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Target Countries:</b></td>
                        <td>
                            {profile.target_countries
                                ? Array.isArray(profile.target_countries)
                                    ? profile.target_countries.join(", ")
                                    : (() => {
                                        try {
                                            return JSON.parse(profile.target_countries).join(", ");
                                        } catch {
                                            return "-";
                                        }
                                    })()
                                : "-"}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Preferred Languages:</b></td>
                        <td>
                            {profile.preferred_languages
                                ? Array.isArray(profile.preferred_languages)
                                    ? profile.preferred_languages.join(", ")
                                    : (() => {
                                        try {
                                            return JSON.parse(profile.preferred_languages).join(", ");
                                        } catch {
                                            return "-";
                                        }
                                    })()
                                : "-"}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Financial Need Level:</b></td>
                        <td>{financialLevels[profile.financial_need_level] || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>CV:</b></td>
                        <td>
                            {profile.cv_url ? (
                                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                                    View CV
                                </a>
                            ) : (
                                "-"
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td><b>Bio:</b></td>
                        <td>{profile.bio || "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Assigned Staff ID:</b></td>
                        <td>{profile.assigned_staff_id || "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserProfile;