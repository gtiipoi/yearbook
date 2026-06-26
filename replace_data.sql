-- ============================================
-- 清除旧数据 + 导入新学生名单
-- ============================================

-- 清除旧评价（引用旧学生ID）
DELETE FROM public.reviews;

-- 清除旧种子学生
DELETE FROM public.students WHERE is_seed = true;

INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s1', '戴用华', '沈阳城市学院', '🌸', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s2', '丰紫艳', '贵州商学院', '🌟', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s3', '黄孝炳', '贵州医科大学', '🦋', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s4', '姜飞鑫', '贵阳学院', '🌙', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s5', '林安莲', '延边大学', '🎀', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s6', '林紫星', '贵州财经大学', '🍀', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s7', '刘朝阳', '贵州商学院', '🐣', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s8', '刘锦艺', '浙江工商大学', '🦊', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s9', '龙海凡', '贵州工程应用技术学院', '🐰', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s10', '龙旺', '厦门理工学院', '🌻', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s11', '陆冬莉', '贵州医科大学', '💎', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s12', '陆林丽', '南京中医药大学', '🎵', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s13', '陆涛', '贵阳学院', '🔥', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s14', '陆勇康', '贵州财经大学', '⚡', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s15', '陆贞广', '南京工业大学', '🌈', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s16', '罗鹏', '六盘水师范学院', '🍭', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s17', '牛鍚', '铜仁学院', '🌌', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s18', '欧文洲', '贵州理工学院', '☀️', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s19', '欧正海', '郑州财经大学', '🦁', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s20', '潘隆百', '遵义师范学院', '🌿', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s21', '沈树平', '湖州师范学院', '🐳', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s22', '石爱香', '遵义医科大学', '🎯', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s23', '石江霞', '贵州商学院', '💪', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s24', '石新佑', '中南民族大学', '🧠', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s25', '石宇洁', '遵义医科大学大学', '🎨', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s26', '王文秀', '沈阳大学', '🚀', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s27', '韦航新', '泉州师范学院', '💡', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s28', '吴邦宇', '长春工程学院', '🔮', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s29', '吴妲珠', '天津商业大学', '🎭', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s30', '吴奉林', '贵州大学', '🌺', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s31', '吴豪', '遵义医科大学', '🍀', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s32', '吴凯', '贵州师范学院', '⭐', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s33', '吴明才', '内蒙古大学', '💫', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s34', '吴通权', '厦门理工学院', '🪐', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s35', '吴文琴', '贵州中医药大学', '🌊', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s36', '吴香情', '贵州财经大学', '🎪', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s37', '吴学香', '成都大学', '🦉', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s38', '吴燕', '凯里学院', '🐉', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s39', '吴尧', '贵州师范大学', '🌴', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s40', '席邦硕', '贵州大学', '🎲', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s41', '杨昌敏', '贵州医科大学', '💎', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s42', '杨春', '渤海大学', '🔑', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s43', '杨江湖', '武汉商学院', '🎁', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s44', '杨维烨', '温州大学', '🦄', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s45', '杨文聪', '暨南大学', '🐙', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s46', '杨再清', '铜仁学院', '🌵', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s47', '姚苏芸', '贵州财经大学', '🍄', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s48', '姚志豪', '贵州中医药大学', '🦜', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s49', '石国浩', '北方民族大学', '🐬', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s50', '吴声恺', '未知', '🌻', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s51', '吴成琳', '未知', '🦩', true);
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES ('s52', '欧红芳', '未知', '🐉', true);

-- 完成！共 52 条学生记录
