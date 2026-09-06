import React, { useRef } from 'react';
import { PersonalInfo } from '../../types';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface PersonalEditorProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalEditor: React.FC<PersonalEditorProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('请上传小于 3MB 的头像图片');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField('avatarUrl', event.target.result as string);
          updateField('showAvatar', true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Name and Target Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="例如：张三"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">求职意向 / 目标职位</label>
          <input
            type="text"
            value={data.targetJob}
            onChange={(e) => updateField('targetJob', e.target.value)}
            placeholder="例如：大宗商品量化策略研究员"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Phone, Email, Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">联系电话</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="138-0000-0000"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">电子邮箱</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="example@domain.com"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">所在城市</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="上海 / 深圳 / 北京"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Experience Years, Education Level, Website */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">工作年限</label>
          <input
            type="text"
            value={data.experienceYears}
            onChange={(e) => updateField('experienceYears', e.target.value)}
            placeholder="例如：5年工作经验 / 应届生"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">最高学历</label>
          <input
            type="text"
            value={data.educationLevel}
            onChange={(e) => updateField('educationLevel', e.target.value)}
            placeholder="例如：硕士 / 本科"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">个人主页 / GitHub</label>
          <input
            type="text"
            value={data.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Avatar Settings */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={data.showAvatar}
              onChange={(e) => updateField('showAvatar', e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>在简历中显示证件照/个人头像</span>
          </label>
        </div>

        {data.showAvatar && (
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-200">
            {/* Avatar Preview */}
            <div className="shrink-0 relative">
              {data.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt="Avatar"
                  className={`w-16 h-20 object-cover border border-slate-300 shadow-xs ${
                    data.avatarShape === 'circle'
                      ? 'rounded-full'
                      : data.avatarShape === 'rounded'
                      ? 'rounded-xl'
                      : 'rounded-none'
                  }`}
                />
              ) : (
                <div className="w-16 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-2 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  上传本地照片
                </button>
                {data.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('avatarUrl', '')}
                    className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    移除
                  </button>
                )}
              </div>

              {/* Avatar Shapes */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>裁剪形状：</span>
                {(['circle', 'rounded', 'square'] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => updateField('avatarShape', shape)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      data.avatarShape === shape
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {shape === 'circle' ? '圆形' : shape === 'rounded' ? '圆角' : '直角'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
