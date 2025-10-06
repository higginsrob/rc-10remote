import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { rc10rService } from '../../services/rc10r';
import { RC10RPatch } from '../../types/rc10r';
import { setPatch } from '../../store/rc10rSlice';

const PatchControls: React.FC = () => {
  const { status } = useAppSelector((state) => state.midi);
  const connected = status === 'connected';
  const { patch } = useAppSelector((state) => state.rc10r);
  const dispatch = useAppDispatch();

  const patchOptions = [
    { value: RC10RPatch.PATCH_1, label: 'Patch 1' },
    { value: RC10RPatch.PATCH_2, label: 'Patch 2' },
    { value: RC10RPatch.PATCH_3, label: 'Patch 3' },
    { value: RC10RPatch.PATCH_4, label: 'Patch 4' },
    { value: RC10RPatch.PATCH_5, label: 'Patch 5' },
    { value: RC10RPatch.PATCH_6, label: 'Patch 6' },
    { value: RC10RPatch.PATCH_7, label: 'Patch 7' },
    { value: RC10RPatch.PATCH_8, label: 'Patch 8' },
    { value: RC10RPatch.PATCH_9, label: 'Patch 9' },
    { value: RC10RPatch.PATCH_10, label: 'Patch 10' },
    { value: RC10RPatch.PATCH_11, label: 'Patch 11' },
    { value: RC10RPatch.PATCH_12, label: 'Patch 12' },
    { value: RC10RPatch.PATCH_13, label: 'Patch 13' },
    { value: RC10RPatch.PATCH_14, label: 'Patch 14' },
    { value: RC10RPatch.PATCH_15, label: 'Patch 15' },
    { value: RC10RPatch.PATCH_16, label: 'Patch 16' },
    { value: RC10RPatch.PATCH_17, label: 'Patch 17' },
    { value: RC10RPatch.PATCH_18, label: 'Patch 18' },
    { value: RC10RPatch.PATCH_19, label: 'Patch 19' },
    { value: RC10RPatch.PATCH_20, label: 'Patch 20' },
    { value: RC10RPatch.PATCH_21, label: 'Patch 21' },
    { value: RC10RPatch.PATCH_22, label: 'Patch 22' },
    { value: RC10RPatch.PATCH_23, label: 'Patch 23' },
    { value: RC10RPatch.PATCH_24, label: 'Patch 24' },
    { value: RC10RPatch.PATCH_25, label: 'Patch 25' },
    { value: RC10RPatch.PATCH_26, label: 'Patch 26' },
    { value: RC10RPatch.PATCH_27, label: 'Patch 27' },
    { value: RC10RPatch.PATCH_28, label: 'Patch 28' },
    { value: RC10RPatch.PATCH_29, label: 'Patch 29' },
    { value: RC10RPatch.PATCH_30, label: 'Patch 30' },
    { value: RC10RPatch.PATCH_31, label: 'Patch 31' },
    { value: RC10RPatch.PATCH_32, label: 'Patch 32' },
    { value: RC10RPatch.PATCH_33, label: 'Patch 33' },
    { value: RC10RPatch.PATCH_34, label: 'Patch 34' },
    { value: RC10RPatch.PATCH_35, label: 'Patch 35' },
    { value: RC10RPatch.PATCH_36, label: 'Patch 36' },
    { value: RC10RPatch.PATCH_37, label: 'Patch 37' },
    { value: RC10RPatch.PATCH_38, label: 'Patch 38' },
    { value: RC10RPatch.PATCH_39, label: 'Patch 39' },
    { value: RC10RPatch.PATCH_40, label: 'Patch 40' },
    { value: RC10RPatch.PATCH_41, label: 'Patch 41' },
    { value: RC10RPatch.PATCH_42, label: 'Patch 42' },
    { value: RC10RPatch.PATCH_43, label: 'Patch 43' },
    { value: RC10RPatch.PATCH_44, label: 'Patch 44' },
    { value: RC10RPatch.PATCH_45, label: 'Patch 45' },
    { value: RC10RPatch.PATCH_46, label: 'Patch 46' },
    { value: RC10RPatch.PATCH_47, label: 'Patch 47' },
    { value: RC10RPatch.PATCH_48, label: 'Patch 48' },
    { value: RC10RPatch.PATCH_49, label: 'Patch 49' },
    { value: RC10RPatch.PATCH_50, label: 'Patch 50' },
    { value: RC10RPatch.PATCH_51, label: 'Patch 51' },
    { value: RC10RPatch.PATCH_52, label: 'Patch 52' },
    { value: RC10RPatch.PATCH_53, label: 'Patch 53' },
    { value: RC10RPatch.PATCH_54, label: 'Patch 54' },
    { value: RC10RPatch.PATCH_55, label: 'Patch 55' },
    { value: RC10RPatch.PATCH_56, label: 'Patch 56' },
    { value: RC10RPatch.PATCH_57, label: 'Patch 57' },
    { value: RC10RPatch.PATCH_58, label: 'Patch 58' },
    { value: RC10RPatch.PATCH_59, label: 'Patch 59' },
    { value: RC10RPatch.PATCH_60, label: 'Patch 60' },
    { value: RC10RPatch.PATCH_61, label: 'Patch 61' },
    { value: RC10RPatch.PATCH_62, label: 'Patch 62' },
    { value: RC10RPatch.PATCH_63, label: 'Patch 63' },
    { value: RC10RPatch.PATCH_64, label: 'Patch 64' },
    { value: RC10RPatch.PATCH_65, label: 'Patch 65' },
    { value: RC10RPatch.PATCH_66, label: 'Patch 66' },
    { value: RC10RPatch.PATCH_67, label: 'Patch 67' },
    { value: RC10RPatch.PATCH_68, label: 'Patch 68' },
    { value: RC10RPatch.PATCH_69, label: 'Patch 69' },
    { value: RC10RPatch.PATCH_70, label: 'Patch 70' },
    { value: RC10RPatch.PATCH_71, label: 'Patch 71' },
    { value: RC10RPatch.PATCH_72, label: 'Patch 72' },
    { value: RC10RPatch.PATCH_73, label: 'Patch 73' },
    { value: RC10RPatch.PATCH_74, label: 'Patch 74' },
    { value: RC10RPatch.PATCH_75, label: 'Patch 75' },
    { value: RC10RPatch.PATCH_76, label: 'Patch 76' },
    { value: RC10RPatch.PATCH_77, label: 'Patch 77' },
    { value: RC10RPatch.PATCH_78, label: 'Patch 78' },
    { value: RC10RPatch.PATCH_79, label: 'Patch 79' },
    { value: RC10RPatch.PATCH_80, label: 'Patch 80' },
    { value: RC10RPatch.PATCH_81, label: 'Patch 81' },
    { value: RC10RPatch.PATCH_82, label: 'Patch 82' },
    { value: RC10RPatch.PATCH_83, label: 'Patch 83' },
    { value: RC10RPatch.PATCH_84, label: 'Patch 84' },
    { value: RC10RPatch.PATCH_85, label: 'Patch 85' },
    { value: RC10RPatch.PATCH_86, label: 'Patch 86' },
    { value: RC10RPatch.PATCH_87, label: 'Patch 87' },
    { value: RC10RPatch.PATCH_88, label: 'Patch 88' },
    { value: RC10RPatch.PATCH_89, label: 'Patch 89' },
    { value: RC10RPatch.PATCH_90, label: 'Patch 90' },
    { value: RC10RPatch.PATCH_91, label: 'Patch 91' },
    { value: RC10RPatch.PATCH_92, label: 'Patch 92' },
    { value: RC10RPatch.PATCH_93, label: 'Patch 93' },
    { value: RC10RPatch.PATCH_94, label: 'Patch 94' },
    { value: RC10RPatch.PATCH_95, label: 'Patch 95' },
    { value: RC10RPatch.PATCH_96, label: 'Patch 96' },
    { value: RC10RPatch.PATCH_97, label: 'Patch 97' },
    { value: RC10RPatch.PATCH_98, label: 'Patch 98' },
    { value: RC10RPatch.PATCH_99, label: 'Patch 99' },
  ];

  const handlePatchChange = async (newPatch: RC10RPatch) => {
    
    // Always update the Redux state for UI synchronization
    dispatch(setPatch(newPatch));
    
    // Send MIDI command only if device is connected
    if (connected) {
      await rc10rService.setPatch(newPatch);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Label */}
      <label htmlFor="patch-select" className="hidden sm:block text-sm font-medium text-gray-700 whitespace-nowrap">
        Patch:
      </label>
      
      {/* Mobile/Desktop Select */}
      <select
        id="patch-select"
        value={patch.current}
        onChange={(e) => handlePatchChange(Number(e.target.value) as RC10RPatch)}
        disabled={!connected}
        className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-boss-red focus:border-boss-red disabled:bg-gray-100 disabled:cursor-not-allowed bg-white/95 backdrop-blur-sm text-xs sm:text-sm min-w-[80px] sm:min-w-[120px] max-w-[120px] sm:max-w-none"
        title={!connected ? "Connect your RC-10r to select memory patches" : "Select memory patch"}
      >
        {patchOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatchControls;