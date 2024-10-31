import SettingsPanel from "./SettingsPanel";

export default function page() {
    return (
        <div className="p-4">
            <p className="font-bold text-xl text-cstm-secondary mb-4">Settings</p>
            <SettingsPanel></SettingsPanel>
        </div>
    )
}