const fs = require('fs');
let file = fs.readFileSync('src/pages/CitizenDashboard.tsx', 'utf8');

const target = `              </div>
            </div>
          </div>
        </div>
      </main>`;

const replacement = `              </div>
            </div>
          </div>
        </div>
          </>
        ) : (
          <div className="mt-4">
            <AnalyticsDashboard readOnly={true} />
          </div>
        )}
      </main>`;

if (file.includes(target)) {
  file = file.replace(target, replacement);
  fs.writeFileSync('src/pages/CitizenDashboard.tsx', file);
  console.log("Successfully patched closing main tag.");
} else {
  console.log("Could not find the target string.");
}
