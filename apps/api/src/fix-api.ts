import fs from 'fs';
const file = 'src/routes/tools.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix UPDATE query
code = code.replace(/category_id = \$10, category_name = \$11, category_icon = \$12,[\s]+pricing_model = \$13, pricing_details = \$14,/g, 'category_id = $10, category_name = $11, category_icon = $12, sub_category = $13, micro_category = $14,\n            pricing_model = $15, pricing_details = $16,');
code = code.replace(/developer_name = \$15, model_version = \$16, platform_type = \$17, launch_date = \$18,/g, 'developer_name = $17, model_version = $18, platform_type = $19, launch_date = $20,');
code = code.replace(/tool_status = \$19, is_featured = \$20, integrations = \$21, rating = \$22, tags = \$23, source = \$24[\s]+WHERE id = \$25/g, 'tool_status = $21, is_featured = $22, integrations = $23, rating = $24, tags = $25, source = $26\n          WHERE id = $27');

// Fix INSERT query columns
code = code.replace(/category_id, category_name, category_icon,[\s]+pricing_model, pricing_details,/g, 'category_id, category_name, category_icon, sub_category, micro_category,\n            pricing_model, pricing_details,');
code = code.replace(/category_id, category_name, category_icon,[\s]+pricing_model, pricing_details,/g, 'category_id, category_name, category_icon, sub_category, micro_category,\n            pricing_model, pricing_details,'); // in case of multiple

// Fix INSERT query placeholders
code = code.replace(/\$10, \$11, \$12,[\s]+\$13, \$14, \$15,/g, '$10, $11, $12, $13, $14,\n            $15, $16, $17,');
code = code.replace(/\$16, \$17, \$18, \$19,[\s]+\$20, \$21, \$22, \$23, \$24/g, '$18, $19, $20, $21,\n            $22, $23, $24, $25, $26');

// Fix query parameter arrays
code = code.replace(/resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon,[\s]+pricing_model, pricing_details,/g, 'resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,\n            pricing_model, pricing_details,');
code = code.replace(/resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,[\s]+pricing_model, pricing_details,/g, 'resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,\n            pricing_model, pricing_details,');

fs.writeFileSync(file, code);
console.log('Fixed API tools.ts');
